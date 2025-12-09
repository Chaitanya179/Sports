import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Booking = sequelize.define('Booking', {
  startTime: { type: DataTypes.DATE, allowNull: false },
  endTime: { type: DataTypes.DATE, allowNull: false },
  status: {
    type: DataTypes.ENUM('confirmed', 'cancelled', 'waitlist'),
    defaultValue: 'confirmed'
  },
  pricingBreakdown: { type: DataTypes.JSON, allowNull: true },
  waitlistPosition: { type: DataTypes.INTEGER, allowNull: true }   // ⬅ important
});
