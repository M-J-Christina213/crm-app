import express from "express";
import Lead from "../models/Lead.js";

const router = express.Router();

// GET DASHBOARD STATS
router.get("/", async (req, res) => {
  try {
    const leads = await Lead.find();

    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === "New").length;
    const qualifiedLeads = leads.filter(l => l.status === "Qualified").length;
    const wonLeads = leads.filter(l => l.status === "Won").length;
    const lostLeads = leads.filter(l => l.status === "Lost").length;

    const totalDealValue = leads.reduce((sum, l) => sum + l.dealValue, 0);
    const wonDealValue = leads
      .filter(l => l.status === "Won")
      .reduce((sum, l) => sum + l.dealValue, 0);

    res.json({
      totalLeads,
      newLeads,
      qualifiedLeads,
      wonLeads,
      lostLeads,
      totalDealValue,
      wonDealValue
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;