import mongoose from "mongoose";

const expertSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    image: { type: String, trim: true },
    role: { type: String, trim: true, default: "Travel Expert" },
  },
  { timestamps: true }
);

expertSchema.index({ createdAt: -1 });

export const Expert = mongoose.model("Expert", expertSchema);

