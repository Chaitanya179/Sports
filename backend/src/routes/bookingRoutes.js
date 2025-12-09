import express from 'express';
import {
  getBookings,
  createBooking,
  quotePrice,
  cancelBooking,
  deleteBooking
} from '../controllers/bookingController.js';

const router = express.Router();

router.get('/', getBookings);
router.post('/', createBooking);
router.post('/quote', quotePrice);

// cancel (PATCH)
router.post('/:id/cancel', cancelBooking);

// **delete booking**
router.delete('/:id', deleteBooking);

export default router;
