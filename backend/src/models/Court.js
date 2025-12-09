
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Court = sequelize.define('Court', {
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.ENUM('indoor', 'outdoor'), allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  basePricePerHour: { type: DataTypes.FLOAT, allowNull: false }
});
