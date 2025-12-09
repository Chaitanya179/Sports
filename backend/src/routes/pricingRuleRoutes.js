
import express from 'express';
import { getPricingRules, createPricingRule, updatePricingRule } from '../controllers/pricingRuleController.js';

const router = express.Router();

router.get('/', getPricingRules);
router.post('/', createPricingRule);
router.put('/:id', updatePricingRule);

export default router;
