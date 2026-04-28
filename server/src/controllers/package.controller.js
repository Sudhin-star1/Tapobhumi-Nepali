import { z } from "zod";
import slugify from "slugify";

import { Package } from "../models/Package.js";
import { HttpError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary.js";

const itineraryItemSchema = z.object({
  day: z.coerce.number().int().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

const createSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  duration: z.string().min(1),
  category: z.enum(["trek", "tour", "spiritual"]),
  itinerary: z.array(itineraryItemSchema).optional(),
  price: z.coerce.number().optional(),
  images: z.array(z.string()).optional(),
  featured: z.coerce.boolean().optional(),
});

const updateSchema = createSchema.partial();

export const listPackages = asyncHandler(async (req, res) => {
  const featured = req.query.featured === "true";
  const q = featured ? { featured: true } : {};
  const items = await Package.find(q).sort({ createdAt: -1 });
  res.json(items);
});

export const getPackage = asyncHandler(async (req, res) => {
  const item = await Package.findById(req.params.id);
  if (!item) throw new HttpError(404, "Package not found");
  res.json(item);
});

export const createPackage = asyncHandler(async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, "Invalid payload");

  const data = parsed.data;
  const slug = (data.slug ? data.slug : slugify(data.title, { lower: true, strict: true })).toLowerCase();
  const files = Array.isArray(req.files) ? req.files : [];
  const uploadedUrls = [];
  for (const f of files) {
    if (!f?.buffer) continue;
    const uploaded = await uploadBufferToCloudinary(f.buffer, { folder: "tapobhumi/packages" });
    uploadedUrls.push(uploaded.secure_url);
  }

  const created = await Package.create({
    ...data,
    slug,
    images: [...(data.images ?? []), ...uploadedUrls],
  });
  res.status(201).json(created);
});

export const updatePackage = asyncHandler(async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, "Invalid payload");

  const data = parsed.data;
  if (data.title && !data.slug) {
    data.slug = slugify(data.title, { lower: true, strict: true });
  }

  const files = Array.isArray(req.files) ? req.files : [];
  if (files.length) {
    const uploadedUrls = [];
    for (const f of files) {
      if (!f?.buffer) continue;
      const uploaded = await uploadBufferToCloudinary(f.buffer, { folder: "tapobhumi/packages" });
      uploadedUrls.push(uploaded.secure_url);
    }
    const existing = await Package.findById(req.params.id);
    if (!existing) throw new HttpError(404, "Package not found");
    data.images = [...(data.images ?? existing.images ?? []), ...uploadedUrls];
  }

  const updated = await Package.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  if (!updated) throw new HttpError(404, "Package not found");
  res.json(updated);
});

export const deletePackage = asyncHandler(async (req, res) => {
  const deleted = await Package.findByIdAndDelete(req.params.id);
  if (!deleted) throw new HttpError(404, "Package not found");
  res.json({ ok: true });
});

