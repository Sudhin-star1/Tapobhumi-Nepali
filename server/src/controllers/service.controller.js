import { z } from "zod";
import { Service } from "../models/Service.js";
import { HttpError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().optional(),
});

const updateSchema = createSchema.partial();

export const listServices = asyncHandler(async (req, res) => {
  const items = await Service.find({}).sort({ createdAt: -1 });
  res.json(items);
});

export const createService = asyncHandler(async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, "Invalid payload");
  const created = await Service.create(parsed.data);
  res.status(201).json(created);
});

export const updateService = asyncHandler(async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, "Invalid payload");
  const updated = await Service.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true });
  if (!updated) throw new HttpError(404, "Service not found");
  res.json(updated);
});

export const deleteService = asyncHandler(async (req, res) => {
  const deleted = await Service.findByIdAndDelete(req.params.id);
  if (!deleted) throw new HttpError(404, "Service not found");
  res.json({ ok: true });
});

