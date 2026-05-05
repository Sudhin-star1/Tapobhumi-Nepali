import { z } from "zod";
import { Expert } from "../models/Expert.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

const createSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  role: z.string().optional(),
});

const updateSchema = createSchema.partial();

export const listExperts = asyncHandler(async (req, res) => {
  const items = await Expert.find({}).sort({ createdAt: -1 });
  res.json(items);
});

export const createExpert = asyncHandler(async (req, res) => {
  // eslint-disable-next-line no-console
  console.log("[expert] create body:", req.body);
  // eslint-disable-next-line no-console
  console.log("[expert] create files:", req.file ? 1 : 0);

  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, "Invalid payload");

  const image = req.file?.path;
  const created = await Expert.create({
    ...parsed.data,
    image,
  });
  res.status(201).json(created);
});

export const updateExpert = asyncHandler(async (req, res) => {
  // eslint-disable-next-line no-console
  console.log("[expert] update body:", req.body);

  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, "Invalid payload");

  const patch = { ...parsed.data };
  if (req.file?.path) patch.image = req.file.path;

  const updated = await Expert.findByIdAndUpdate(req.params.id, patch, { new: true, runValidators: true });
  if (!updated) throw new HttpError(404, "Expert not found");
  res.json(updated);
});

export const deleteExpert = asyncHandler(async (req, res) => {
  const deleted = await Expert.findByIdAndDelete(req.params.id);
  if (!deleted) throw new HttpError(404, "Expert not found");
  res.json({ ok: true });
});

