import { Court } from "../models/Court.js";

export const getCourts = async (req, res) => {
  try {
    const courts = await Court.findAll();
    res.json(courts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching courts", error: err.message });
  }
};

export const createCourt = async (req, res) => {
  try {
    const court = await Court.create(req.body);
    res.json(court);
  } catch (err) {
    res.status(400).json({ message: "Error creating court", error: err.message });
  }
};

export const updateCourt = async (req, res) => {
  try {
    const court = await Court.findByPk(req.params.id);
    if (!court) return res.status(404).json({ message: "Court not found" });

    await court.update(req.body);
    res.json({ message: "Court updated", court });
  } catch (err) {
    res.status(400).json({ message: "Error updating court", error: err.message });
  }
};

export const deleteCourt = async (req, res) => {
  try {
    const court = await Court.findByPk(req.params.id);
    if (!court) return res.status(404).json({ message: "Court not found" });

    await court.destroy();
    res.json({ message: "Court deleted" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting court", error: err.message });
  }
};
