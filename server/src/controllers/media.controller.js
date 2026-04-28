import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

const removeSchema = z.object({
  url: z.string().url(),
});

const reorderSchema = z.object({
  images: z.array(z.string().url()),
});

export const removeImage = ({ Model }) =>
  asyncHandler(async (req, res) => {
    const parsed = removeSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, "Invalid payload");

    const doc = await Model.findById(req.params.id);
    if (!doc) throw new HttpError(404, "Not found");

    const before = doc.images?.length || 0;
    doc.images = (doc.images || []).filter((u) => u !== parsed.data.url);
    const after = doc.images.length;

    if (before === after) throw new HttpError(404, "Image not found");
    await doc.save();
    res.json(doc);
  });

export const reorderImages = ({ Model }) =>
  asyncHandler(async (req, res) => {
    const parsed = reorderSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, "Invalid payload");

    const doc = await Model.findById(req.params.id);
    if (!doc) throw new HttpError(404, "Not found");

    const existing = new Set((doc.images || []).map(String));
    const incoming = parsed.data.images.map(String);

    // Ensure incoming is a permutation/subset of existing (no foreign URLs)
    for (const u of incoming) {
      if (!existing.has(u)) throw new HttpError(400, "Images must match existing URLs");
    }

    // Keep only the incoming order; optionally append missing ones to end
    const missing = (doc.images || []).filter((u) => !incoming.includes(String(u)));
    doc.images = [...incoming, ...missing];
    await doc.save();
    res.json(doc);
  });

