
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Equipment = sequelize.define('Equipment', {
  name: { type: DataTypes.STRING, allowNull: false },
  totalStock: { type: DataTypes.INTEGER, allowNull: false },
  pricePerUnit: { type: DataTypes.FLOAT, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
});
