import { z } from "zod";
import { Trek } from "../models/Trek.js";
import { HttpError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

const updateSchema = createSchema.partial();

export const listTreks = asyncHandler(async (req, res) => {
  const items = await Trek.find({}).sort({ createdAt: -1 });
  res.json(items);
});

export const createTrek = asyncHandler(async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, "Invalid payload");
  // Debugging: see incoming multipart fields/files
  // eslint-disable-next-line no-console
  console.log("[trek] create body:", req.body);
  // eslint-disable-next-line no-console
  console.log("[trek] create files:", Array.isArray(req.files) ? req.files.length : 0);

  const images =
    Array.isArray(req.files) ? req.files.map((f) => f?.path).filter(Boolean) : [];

  const created = await Trek.create({ ...parsed.data, images });
  res.status(201).json(created);
});

export const updateTrek = asyncHandler(async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, "Invalid payload");
  // eslint-disable-next-line no-console
  console.log("[trek] update body:", req.body);
  // eslint-disable-next-line no-console
  console.log("[trek] update files:", Array.isArray(req.files) ? req.files.length : 0);

  const patch = { ...parsed.data };
  if (Array.isArray(req.files) && req.files.length) {
    const incoming = req.files.map((f) => f?.path).filter(Boolean);
    const existing = await Trek.findById(req.params.id);
    if (!existing) throw new HttpError(404, "Trek not found");
    patch.images = [...(existing.images ?? []), ...incoming];
  }

  const updated = await Trek.findByIdAndUpdate(req.params.id, patch, { new: true, runValidators: true });
  if (!updated) throw new HttpError(404, "Trek not found");
  res.json(updated);
});

export const deleteTrek = asyncHandler(async (req, res) => {
  const deleted = await Trek.findByIdAndDelete(req.params.id);
  if (!deleted) throw new HttpError(404, "Trek not found");
  res.json({ ok: true });
});

