
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, sequelize } from './src/config/db.js';
import courtRoutes from './src/routes/courtRoutes.js';
import equipmentRoutes from './src/routes/equipmentRoutes.js';
import coachRoutes from './src/routes/coachRoutes.js';
import pricingRuleRoutes from './src/routes/pricingRuleRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';
import './src/models/index.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Sports Booking API running' });
});

app.use('/api/courts', courtRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/pricing-rules', pricingRuleRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await sequelize.sync();
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
