
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const PricingRule = sequelize.define('PricingRule', {
  name: { type: DataTypes.STRING, allowNull: false },
  type: {
    type: DataTypes.ENUM('peak_hours', 'weekend', 'indoor_premium', 'holiday', 'custom'),
    allowNull: false
  },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  // conditions: { daysOfWeek, startHour, endHour, courtType, dates }
  conditions: { type: DataTypes.JSON, allowNull: true },
  // effect: { multiplier, flatSurcharge }
  effect: { type: DataTypes.JSON, allowNull: false }
});
