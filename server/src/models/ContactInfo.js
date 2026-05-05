import mongoose from "mongoose";

const contactInfoSchema = new mongoose.Schema(
  {
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    whatsapp: { type: String, trim: true },
    socialLinks: {
      type: Map,
      of: String,
      default: {},
    },
    _singleton: { type: String, unique: true, default: "CONTACT_INFO_SINGLETON" },
  },
  { timestamps: true }
);

export const ContactInfo = mongoose.model("ContactInfo", contactInfoSchema);

