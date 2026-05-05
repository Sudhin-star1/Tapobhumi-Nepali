import { z } from "zod";
import { Gallery } from "../models/Gallery.js";
import { HttpError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary.js";

const createSchema = z.object({
  title: z.string().min(1),
  imageUrl: z.string().url().optional(),
});

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  imageUrl: z.string().url().optional(),
});

export const listGallery = asyncHandler(async (req, res) => {
  const items = await Gallery.find({}).sort({ createdAt: -1 });
  res.json(items);
});

export const createGalleryItem = asyncHandler(async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, "Invalid payload");

  const data = parsed.data;
  let imageUrl = data.imageUrl;

  if (!imageUrl) {
    const file = req.file;
    if (!file?.buffer) throw new HttpError(400, "Image file is required");
    const uploaded = await uploadBufferToCloudinary(file.buffer, { folder: "tapobhumi/gallery" });
    imageUrl = uploaded.secure_url;
  }

  const created = await Gallery.create({ title: data.title, imageUrl });
  res.status(201).json(created);
});

export const updateGalleryItem = asyncHandler(async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, "Invalid payload");

  const patch = { ...parsed.data };

  if (!patch.imageUrl && req.file?.buffer) {
    const uploaded = await uploadBufferToCloudinary(req.file.buffer, { folder: "tapobhumi/gallery" });
    patch.imageUrl = uploaded.secure_url;
  }

  const updated = await Gallery.findByIdAndUpdate(req.params.id, patch, { new: true, runValidators: true });
  if (!updated) throw new HttpError(404, "Gallery item not found");
  res.json(updated);
});

export const deleteGalleryItem = asyncHandler(async (req, res) => {
  const deleted = await Gallery.findByIdAndDelete(req.params.id);
  if (!deleted) throw new HttpError(404, "Gallery item not found");
  res.json({ ok: true });
});

