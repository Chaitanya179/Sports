import { Coach } from "../models/Coach.js";

export const getCoaches = async (req, res) => {
  try {
    const coaches = await Coach.findAll();
    res.json(coaches);
  } catch (err) {
    res.status(500).json({ message: "Error fetching coaches", error: err.message });
  }
};

export const createCoach = async (req, res) => {
  try {
    const coach = await Coach.create(req.body);
    res.json(coach);
  } catch (err) {
    res.status(400).json({ message: "Error creating coach", error: err.message });
  }
};

export const updateCoach = async (req, res) => {
  try {
    const coach = await Coach.findByPk(req.params.id);
    if (!coach) return res.status(404).json({ message: "Coach not found" });

    await coach.update(req.body);
    res.json({ message: "Coach updated", coach });
  } catch (err) {
    res.status(400).json({ message: "Error updating coach", error: err.message });
  }
};

export const deleteCoach = async (req, res) => {
  try {
    const coach = await Coach.findByPk(req.params.id);
    if (!coach) return res.status(404).json({ message: "Coach not found" });

    await coach.destroy();
    res.json({ message: "Coach deleted" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting coach", error: err.message });
  }
};
