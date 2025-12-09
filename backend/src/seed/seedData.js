
import dotenv from 'dotenv';
import { sequelize } from '../config/db.js';
import { User, Court, Equipment, Coach, PricingRule } from '../models/index.js';

dotenv.config();

const run = async () => {
  try {
    await sequelize.sync({ force: true });

    await User.create({
      name: 'Test User',
      email: 'user@example.com'
    });

    await Court.bulkCreate([
      { name: 'Court 1', type: 'indoor', basePricePerHour: 10 },
      { name: 'Court 2', type: 'indoor', basePricePerHour: 10 },
      { name: 'Court 3', type: 'outdoor', basePricePerHour: 8 },
      { name: 'Court 4', type: 'outdoor', basePricePerHour: 8 }
    ]);

    await Equipment.bulkCreate([
      { name: 'Racket', totalStock: 20, pricePerUnit: 2 },
      { name: 'Shoes', totalStock: 15, pricePerUnit: 3 }
    ]);

    await Coach.bulkCreate([
      {
        name: 'Coach John',
        hourlyRate: 15,
        availability: [{ dayOfWeek: 1, startHour: 16, endHour: 21 }]
      },
      {
        name: 'Coach Mary',
        hourlyRate: 18,
        availability: [{ dayOfWeek: 3, startHour: 16, endHour: 21 }]
      },
      {
        name: 'Coach Alex',
        hourlyRate: 20,
        availability: [{ dayOfWeek: 5, startHour: 16, endHour: 21 }]
      }
    ]);

    await PricingRule.create({
      name: 'Peak Hours',
      type: 'peak_hours',
      isActive: true,
      conditions: { startHour: 18, endHour: 21 },
      effect: { multiplier: 1.5, flatSurcharge: 0 }
    });

    await PricingRule.create({
      name: 'Weekend',
      type: 'weekend',
      isActive: true,
      conditions: { daysOfWeek: [0, 6] },
      effect: { multiplier: 1, flatSurcharge: 5 }
    });

    await PricingRule.create({
      name: 'Indoor Premium',
      type: 'indoor_premium',
      isActive: true,
      conditions: { courtType: 'indoor' },
      effect: { multiplier: 1.2, flatSurcharge: 0 }
    });

    console.log('✅ Seed data created');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  }
};

run();
