import { Equipment } from "../models/Equipment.js";

export const getEquipment = async (req, res) => {
  try {
    const eq = await Equipment.findAll();
    res.json(eq);
  } catch (err) {
    res.status(500).json({ message: "Error fetching equipment", error: err.message });
  }
};

export const createEquipment = async (req, res) => {
  try {
    const eq = await Equipment.create(req.body);
    res.json(eq);
  } catch (err) {
    res.status(400).json({ message: "Error creating equipment", error: err.message });
  }
};

export const updateEquipment = async (req, res) => {
  try {
    const eq = await Equipment.findByPk(req.params.id);
    if (!eq) return res.status(404).json({ message: "Equipment not found" });

    await eq.update(req.body);
    res.json({ message: "Equipment updated", eq });
  } catch (err) {
    res.status(400).json({ message: "Error updating equipment", error: err.message });
  }
};

export const deleteEquipment = async (req, res) => {
  try {
    const eq = await Equipment.findByPk(req.params.id);
    if (!eq) return res.status(404).json({ message: "Equipment not found" });

    await eq.destroy();
    res.json({ message: "Equipment deleted" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting equipment", error: err.message });
  }
};
