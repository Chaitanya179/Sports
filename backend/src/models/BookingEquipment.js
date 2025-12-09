
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const BookingEquipment = sequelize.define('BookingEquipment', {
  quantity: { type: DataTypes.INTEGER, allowNull: false }
});
