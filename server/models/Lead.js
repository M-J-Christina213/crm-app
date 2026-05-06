import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: String,
    company: String,
    email: String,
    phone: String,
    source: String,
    assignedTo: String,
    status: {
      type: String,
      default: "New"
    },
    dealValue: Number
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);