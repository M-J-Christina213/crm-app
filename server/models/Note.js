import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true
    },

    content: {
      type: String,
      required: true
    },

    createdBy: {
      type: String,
      default: "admin"
    },

    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }


);

export default mongoose.model("Note", noteSchema);