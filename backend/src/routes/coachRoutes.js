import express from 'express';
import { getCoaches, createCoach } from '../controllers/coachController.js';

const router = express.Router();

// List coaches
router.get('/', getCoaches);

// Create coach (supports both /coaches and /coaches/admin)
router.post('/', createCoach);
router.post('/admin', createCoach);

export default router;
