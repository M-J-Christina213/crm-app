import express from "express";
import Lead from "../models/Lead.js";
import Note from "../models/Note.js";

const router = express.Router();

// CREATE lead
router.post("/", async (req, res) => {
  const lead = await Lead.create(req.body);
  res.json(lead);
});

// GET all leads
router.get("/", async (req, res) => {
  const { status, source, assignedTo, search } = req.query;

  let filter = {};

  // filters
  if (status) filter.status = status;
  if (source) filter.source = source;
  if (assignedTo) filter.assignedTo = assignedTo;

  
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }

  const leads = await Lead.find(filter);
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

// DASHBOARD STATS
router.get("/dashboard/stats", async (req, res) => {
  const leads = await Lead.find();

  const stats = {
    totalLeads: leads.length,
    newLeads: leads.filter(l => l.status === "New").length,
    qualifiedLeads: leads.filter(l => l.status === "Qualified").length,
    wonLeads: leads.filter(l => l.status === "Won").length,
    lostLeads: leads.filter(l => l.status === "Lost").length,

    totalDealValue: leads.reduce((sum, l) => sum + (l.dealValue || 0), 0),

    wonDealValue: leads
      .filter(l => l.status === "Won")
      .reduce((sum, l) => sum + (l.dealValue || 0), 0)
  };

  res.json(stats);
});

// ADD NOTE to lead
router.post("/:id/notes", async (req, res) => {
  const note = await Note.create({
    leadId: req.params.id,
    content: req.body.content,
    createdBy: "admin"
  });

  res.json(note);
});

router.get("/:id/notes", async (req, res) => {
  const notes = await Note.find({ leadId: req.params.id }).sort({ createdAt: -1 });
  res.json(notes);
});