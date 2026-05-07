import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    company: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },

    source: {
      type: String,
      enum: ["Website", "LinkedIn", "Referral", "Cold Email", "Event", "Other"],
      default: "Website"
    },

    assignedTo: { type: String },

    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"],
      default: "New"
    },

    dealValue: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);