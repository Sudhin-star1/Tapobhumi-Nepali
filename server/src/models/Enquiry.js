import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    packageName: { type: String, trim: true },
    message: { type: String, trim: true },
    status: { type: String, enum: ["new", "contacted"], default: "new" },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ status: 1, createdAt: -1 });

export const Enquiry = mongoose.model("Enquiry", enquirySchema);

