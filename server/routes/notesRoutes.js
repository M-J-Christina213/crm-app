import express from "express";
import Note from "../models/Note.js";

const router = express.Router();

// GET notes for a lead
router.get("/:leadId", async (req, res) => {
  try {
    const notes = await Note.find({ leadId: req.params.leadId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new note
router.post("/", async (req, res) => {
  try {
    const { leadId, content, createdBy } = req.body;
    const newNote = new Note({ leadId, content, createdBy });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;