import express from 'express';
import { getEquipment, createEquipment } from '../controllers/equipmentController.js';

const router = express.Router();

// List equipment
router.get('/', getEquipment);

// Create equipment (supports both /equipment and /equipment/admin)
router.post('/', createEquipment);
router.post('/admin', createEquipment);

export default router;
