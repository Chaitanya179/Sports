import { Op } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Booking } from '../models/Booking.js';
import { Court } from '../models/Court.js';
import { Coach } from '../models/Coach.js';
import { Equipment } from '../models/Equipment.js';
import { BookingEquipment } from '../models/BookingEquipment.js';
import { User } from '../models/User.js';
import { calculatePrice } from '../utils/priceCalculator.js';

const overlapsCondition = (startTime, endTime) => ({
  startTime: { [Op.lt]: endTime },
  endTime: { [Op.gt]: startTime },
  status: 'confirmed'
});

// Check coach availability based on JSON availability array
const isCoachAvailableBySchedule = (coach, startTime, endTime) => {
  if (!coach.availability || !Array.isArray(coach.availability)) return true;
  const start = new Date(startTime);
  const end = new Date(endTime);
  const day = start.getDay();
  const hourStart = start.getHours();
  const hourEnd = end.getHours();
  return coach.availability.some(slot => {
    return (
      slot.dayOfWeek === day &&
      hourStart >= slot.startHour &&
      hourEnd <= slot.endHour
    );
  });
};

export const getBookings = async (req, res) => {
  try {
    const where = {};
    if (req.query.userId) where.UserId = req.query.userId;
    const bookings = await Booking.findAll({
      where,
      order: [['startTime', 'DESC']],
      include: [Court, Coach, User, Equipment]
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings', error: err.message });
  }
};

export const quotePrice = async (req, res) => {
  try {
    const { courtId, coachId, equipment, startTime, endTime } = req.body;
    const court = await Court.findByPk(courtId);
    if (!court) return res.status(404).json({ message: 'Court not found' });

    let coach = null;
    if (coachId) {
      coach = await Coach.findByPk(coachId);
      if (!coach) return res.status(404).json({ message: 'Coach not found' });
    }

    let equipmentItems = [];
    if (equipment && equipment.length) {
      const ids = equipment.map(e => e.equipmentId);
      const items = await Equipment.findAll({ where: { id: ids } });
      equipmentItems = items.map(item => {
        const reqItem = equipment.find(e => e.equipmentId === item.id);
        return { ...item.toJSON(), quantity: reqItem.quantity };
      });
    }

    const breakdown = await calculatePrice({ court, startTime, endTime, equipmentItems, coach });
    res.json(breakdown);
  } catch (err) {
    res.status(400).json({ message: 'Error calculating price', error: err.message });
  }
};

export const createBooking = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { userId, courtId, coachId, equipment, startTime, endTime, allowWaitlist } = req.body;

    const court = await Court.findByPk(courtId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!court) throw new Error('Court not found');

    const user = await User.findByPk(userId, { transaction: t });
    if (!user) throw new Error('User not found');

    let coach = null;
    if (coachId) {
      coach = await Coach.findByPk(coachId, { transaction: t, lock: t.LOCK.UPDATE });
      if (!coach) throw new Error('Coach not found');
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // -------- Court availability ----------
    const courtConflict = await Booking.findOne({
      where: { CourtId: courtId, ...overlapsCondition(start, end) },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    // -------- Coach availability ----------
    let coachConflict = false;
    if (coach) {
      if (!isCoachAvailableBySchedule(coach, start, end)) {
        coachConflict = true;
      } else {
        const conflict = await Booking.findOne({
          where: { CoachId: coachId, ...overlapsCondition(start, end) },
          transaction: t,
          lock: t.LOCK.UPDATE
        });
        if (conflict) coachConflict = true;
      }
    }

    // -------- Equipment availability ----------
    let equipmentItems = [];
    let equipmentConflict = false;

    if (equipment && equipment.length) {
      const ids = equipment.map(e => e.equipmentId);

      // Load all requested equipment with row locks
      const items = await Equipment.findAll({
        where: { id: ids },
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      // All overlapping confirmed bookings (for equipment)
      const overlappingBookings = await Booking.findAll({
        where: overlapsCondition(start, end),
        attributes: ['id'],
        transaction: t,
        lock: t.LOCK.UPDATE
      });
      const bookingIds = overlappingBookings.map(b => b.id);

      for (const item of items) {
        const reqItem = equipment.find(e => e.equipmentId === item.id);
        let bookedQty = 0;

        if (bookingIds.length > 0) {
          const existing = await BookingEquipment.findAll({
            where: {
              EquipmentId: item.id,
              BookingId: bookingIds
            },
            transaction: t,
            lock: t.LOCK.UPDATE
          });

          bookedQty = existing.reduce((sum, be) => sum + be.quantity, 0);
        }

        if (bookedQty + reqItem.quantity > item.totalStock) {
          equipmentConflict = true;
        } else {
          equipmentItems.push({ ...item.toJSON(), quantity: reqItem.quantity });
        }
      }
    }

    const anyConflict = courtConflict || coachConflict || equipmentConflict;

    let status = 'confirmed';
    let waitlistPosition = null;

    if (anyConflict) {
      if (!allowWaitlist) {
        throw new Error('Resources unavailable for this slot');
      }
      status = 'waitlist';
      // Next waitlist position for same court/time
      const maxPos = await Booking.max('waitlistPosition', {
        where: {
          CourtId: courtId,
          status: 'waitlist',
          startTime,
          endTime
        },
        transaction: t
      });
      waitlistPosition = (maxPos || 0) + 1;
    }

    const pricingBreakdown =
      status === 'confirmed'
        ? await calculatePrice({ court, startTime: start, endTime: end, equipmentItems, coach })
        : null;

    const booking = await Booking.create(
      {
        startTime: start,
        endTime: end,
        pricingBreakdown,
        status,
        waitlistPosition,
        UserId: userId,
        CourtId: courtId,
        CoachId: coachId || null
      },
      { transaction: t }
    );

    if (status === 'confirmed' && equipmentItems.length) {
      for (const item of equipmentItems) {
        await BookingEquipment.create(
          {
            BookingId: booking.id,
            EquipmentId: item.id,
            quantity: item.quantity
          },
          { transaction: t }
        );
      }
    }

    await t.commit();

    const created = await Booking.findByPk(booking.id, {
      include: [Court, Coach, User, Equipment]
    });

    res.status(201).json(created);
  } catch (err) {
    await t.rollback();
    res.status(400).json({ message: 'Error creating booking', error: err.message });
  }
};

export const cancelBooking = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const bookingId = req.params.id;

    // 1. Find the booking to cancel
    const booking = await Booking.findByPk(bookingId, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!booking) {
      await t.rollback();
      return res.status(404).json({ message: 'Booking not found' });
    }

    // 2. Mark it as cancelled
    booking.status = 'cancelled';
    await booking.save({ transaction: t });

    // 3. Find next waitlist booking for same court & time
    const next = await Booking.findOne({
      where: {
        CourtId: booking.CourtId,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: 'waitlist'
      },
      order: [['waitlistPosition', 'ASC']],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    let promoted = null;

    if (next) {
      // Promote waitlist booking
      next.status = 'confirmed';
      next.waitlistPosition = null;

      // Load court & coach
      const court = await Court.findByPk(next.CourtId, { transaction: t });
      const coach = next.CoachId
        ? await Coach.findByPk(next.CoachId, { transaction: t })
        : null;

      // Load equipment relations (no include)
      const relations = await BookingEquipment.findAll({
        where: { BookingId: next.id },
        transaction: t
      });

      let equipmentItems = [];
      if (relations.length > 0) {
        const equipmentIds = [...new Set(relations.map(r => r.EquipmentId))];
        const equipments = await Equipment.findAll({
          where: { id: equipmentIds },
          transaction: t
        });

        equipmentItems = relations.map(rel => {
          const eq = equipments.find(e => e.id === rel.EquipmentId);
          return {
            ...eq.toJSON(),
            quantity: rel.quantity
          };
        });
      }

      // Recalculate price for promoted booking
      next.pricingBreakdown = await calculatePrice({
        court,
        startTime: next.startTime,
        endTime: next.endTime,
        equipmentItems,
        coach
      });

      await next.save({ transaction: t });
      promoted = next;
    }

    await t.commit();

    return res.json({
      message: 'Booking cancelled',
      promotedWaitlistBookingId: promoted ? promoted.id : null
    });
  } catch (err) {
    await t.rollback();
    return res
      .status(400)
      .json({ message: 'Error cancelling booking', error: err.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await booking.destroy();
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting booking", error: err.message });
  }
};

