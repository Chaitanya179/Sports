import express from 'express';
import { getCourts, createCourt } from '../controllers/courtController.js';

const router = express.Router();

// List courts
router.get('/', getCourts);

// Create court (supports both /courts and /courts/admin)
router.post('/', createCourt);
router.post('/admin', createCourt);

export default router;
