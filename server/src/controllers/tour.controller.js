import { z } from "zod";
import { Tour } from "../models/Tour.js";
import { HttpError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createSchema = z.object({
  name: z.string().min(1),
  route: z.string().min(1),
  description: z.string().optional(),
});

const updateSchema = createSchema.partial();

export const listTours = asyncHandler(async (req, res) => {
  const items = await Tour.find({}).sort({ createdAt: -1 });
  res.json(items);
});

export const createTour = asyncHandler(async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, "Invalid payload");
  // eslint-disable-next-line no-console
  console.log("[tour] create body:", req.body);
  // eslint-disable-next-line no-console
  console.log("[tour] create files:", Array.isArray(req.files) ? req.files.length : 0);

  const images =
    Array.isArray(req.files) ? req.files.map((f) => f?.path).filter(Boolean) : [];

  const created = await Tour.create({ ...parsed.data, images });
  res.status(201).json(created);
});

export const updateTour = asyncHandler(async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, "Invalid payload");
  // eslint-disable-next-line no-console
  console.log("[tour] update body:", req.body);
  // eslint-disable-next-line no-console
  console.log("[tour] update files:", Array.isArray(req.files) ? req.files.length : 0);

  const patch = { ...parsed.data };
  if (Array.isArray(req.files) && req.files.length) {
    const incoming = req.files.map((f) => f?.path).filter(Boolean);
    const existing = await Tour.findById(req.params.id);
    if (!existing) throw new HttpError(404, "Tour not found");
    patch.images = [...(existing.images ?? []), ...incoming];
  }

  const updated = await Tour.findByIdAndUpdate(req.params.id, patch, { new: true, runValidators: true });
  if (!updated) throw new HttpError(404, "Tour not found");
  res.json(updated);
});

export const deleteTour = asyncHandler(async (req, res) => {
  const deleted = await Tour.findByIdAndDelete(req.params.id);
  if (!deleted) throw new HttpError(404, "Tour not found");
  res.json({ ok: true });
});

