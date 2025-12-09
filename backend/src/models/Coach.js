
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Coach = sequelize.define('Coach', {
  name: { type: DataTypes.STRING, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  hourlyRate: { type: DataTypes.FLOAT, allowNull: false },
  // availability: [{ dayOfWeek, startHour, endHour }]
  availability: { type: DataTypes.JSON, allowNull: true }
});
