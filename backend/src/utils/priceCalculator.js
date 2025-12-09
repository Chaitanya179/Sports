
import { PricingRule } from '../models/PricingRule.js';

export const calculatePrice = async ({ court, startTime, endTime, equipmentItems, coach }) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const hours = (end - start) / (1000 * 60 * 60);

  const baseCourtPrice = court.basePricePerHour * hours;
  const rules = await PricingRule.findAll({ where: { isActive: true } });

  let multiplier = 1;
  let flatSurcharge = 0;

  const hour = start.getHours();
  const day = start.getDay();

  for (const rule of rules) {
    const cond = rule.conditions || {};
    const eff = rule.effect || {};

    const appliesDay =
      !cond.daysOfWeek || cond.daysOfWeek.length === 0 || cond.daysOfWeek.includes(day);
    const appliesHour =
      (cond.startHour == null || hour >= cond.startHour) &&
      (cond.endHour == null || hour < cond.endHour);
    const appliesCourtType =
      !cond.courtType || cond.courtType === 'any' || cond.courtType === court.type;

    let appliesDate = true;
    if (cond.dates && cond.dates.length > 0) {
      const dStr = start.toISOString().substring(0, 10);
      appliesDate = cond.dates.map((x) => x.substring(0, 10)).includes(dStr);
    }

    if (appliesDay && appliesHour && appliesCourtType && appliesDate) {
      if (eff.multiplier) multiplier *= eff.multiplier;
      if (eff.flatSurcharge) flatSurcharge += eff.flatSurcharge;
    }
  }

  let equipmentFee = 0;
  if (equipmentItems && equipmentItems.length) {
    for (const item of equipmentItems) {
      equipmentFee += item.pricePerUnit * item.quantity * hours;
    }
  }

  let coachFee = 0;
  if (coach) {
    coachFee = coach.hourlyRate * hours;
  }

  const totalBeforeRules = baseCourtPrice + equipmentFee + coachFee;
  const afterMultiplier = totalBeforeRules * multiplier;
  const total = afterMultiplier + flatSurcharge;

  return {
    baseCourtPrice,
    equipmentFee,
    coachFee,
    multiplier,
    flatSurcharge,
    total
  };
};
