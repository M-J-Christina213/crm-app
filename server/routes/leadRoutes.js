import express from "express";
import Lead from "../models/Lead.js";

const router = express.Router();

// CREATE lead
router.post("/", async (req, res) => {
  const lead = await Lead.create(req.body);
  res.json(lead);
});

// GET all leads
router.get("/", async (req, res) => {
  const leads = await Lead.find();
  res.json(leads);
});

// UPDATE lead
router.put("/:id", async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(lead);
});

// DELETE lead
router.delete("/:id", async (req, res) => {
  await Lead.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;