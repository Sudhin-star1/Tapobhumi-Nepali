import { z } from "zod";

import { Enquiry } from "../models/Enquiry.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

const createSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional(),
  packageName: z.string().optional(),
  message: z.string().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(["new", "contacted"]),
});

export const createEnquiry = asyncHandler(async (req, res) => {
  // Debugging: log request body (avoid logging secrets; form contains no passwords)
  // eslint-disable-next-line no-console
  console.log("[enquiry] create body:", req.body);

  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, "Invalid payload");

  const created = await Enquiry.create(parsed.data);
  res.status(201).json({ ok: true, enquiry: created });
});

export const listEnquiries = asyncHandler(async (req, res) => {
  const items = await Enquiry.find({}).sort({ createdAt: -1 });
  res.json(items);
});

export const updateEnquiryStatus = asyncHandler(async (req, res) => {
  const parsed = updateStatusSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, "Invalid payload");

  const updated = await Enquiry.findByIdAndUpdate(
    req.params.id,
    { status: parsed.data.status },
    { new: true, runValidators: true }
  );
  if (!updated) throw new HttpError(404, "Enquiry not found");
  res.json(updated);
});

export const deleteEnquiry = asyncHandler(async (req, res) => {
  const deleted = await Enquiry.findByIdAndDelete(req.params.id);
  if (!deleted) throw new HttpError(404, "Enquiry not found");
  res.json({ ok: true });
});

