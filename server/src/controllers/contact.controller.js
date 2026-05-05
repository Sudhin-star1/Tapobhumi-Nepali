import { z } from "zod";
import { ContactInfo } from "../models/ContactInfo.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

const updateSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email().optional(),
  whatsapp: z.string().optional(),
  socialLinks: z.record(z.string()).optional(),
});

async function getSingleton() {
  const existing = await ContactInfo.findOne({ _singleton: "CONTACT_INFO_SINGLETON" });
  if (existing) return existing;
  return await ContactInfo.create({ _singleton: "CONTACT_INFO_SINGLETON" });
}

export const getContactInfo = asyncHandler(async (req, res) => {
  const doc = await getSingleton();
  res.json(doc);
});

export const updateContactInfo = asyncHandler(async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, "Invalid payload");

  const doc = await getSingleton();
  doc.set(parsed.data);
  await doc.save();
  res.json(doc);
});

