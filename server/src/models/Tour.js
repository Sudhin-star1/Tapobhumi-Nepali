import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    route: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Tour = mongoose.model("Tour", tourSchema);

