import mongoose from "mongoose";

const trekSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Trek = mongoose.model("Trek", trekSchema);

