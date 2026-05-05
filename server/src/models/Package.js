import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true, min: 1 },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const packageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    duration: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ["trek", "tour", "spiritual"] },
    itinerary: { type: [itinerarySchema], default: [] },
    price: { type: Number },
    images: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

packageSchema.index({ featured: 1, createdAt: -1 });

export const Package = mongoose.model("Package", packageSchema);

