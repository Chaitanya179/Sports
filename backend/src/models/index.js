
import { User } from './User.js';
import { Court } from './Court.js';
import { Equipment } from './Equipment.js';
import { Coach } from './Coach.js';
import { PricingRule } from './PricingRule.js';
import { Booking } from './Booking.js';
import { BookingEquipment } from './BookingEquipment.js';

// Associations
User.hasMany(Booking);
Booking.belongsTo(User);

Court.hasMany(Booking);
Booking.belongsTo(Court);

Coach.hasMany(Booking);
Booking.belongsTo(Coach);

Booking.belongsToMany(Equipment, { through: BookingEquipment });
Equipment.belongsToMany(Booking, { through: BookingEquipment });

export { User, Court, Equipment, Coach, PricingRule, Booking, BookingEquipment };
