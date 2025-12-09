import { PricingRule } from "../models/PricingRule.js";

export const getPricingRules = async (req, res) => {
  try {
    const rules = await PricingRule.findAll();
    res.json(rules);
  } catch (err) {
    res.status(500).json({ message: "Error fetching rules", error: err.message });
  }
};

export const createPricingRule = async (req, res) => {
  try {
    const rule = await PricingRule.create(req.body);
    res.json(rule);
  } catch (err) {
    res.status(400).json({ message: "Error creating rule", error: err.message });
  }
};

export const updatePricingRule = async (req, res) => {
  try {
    const rule = await PricingRule.findByPk(req.params.id);
    if (!rule) return res.status(404).json({ message: "Rule not found" });

    await rule.update(req.body);
    res.json({ message: "Rule updated", rule });
  } catch (err) {
    res.status(400).json({ message: "Error updating rule", error: err.message });
  }
};

export const deletePricingRule = async (req, res) => {
  try {
    const rule = await PricingRule.findByPk(req.params.id);
    if (!rule) return res.status(404).json({ message: "Rule not found" });

    await rule.destroy();
    res.json({ message: "Rule deleted" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting rule", error: err.message });
  }
};
