import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { createGalleryItem, deleteGalleryItem, listGallery, updateGalleryItem } from "../controllers/gallery.controller.js";

export const galleryRouter = Router();

galleryRouter.get("/", listGallery);
galleryRouter.post("/", requireAdmin, upload.single("image"), createGalleryItem);
galleryRouter.put("/:id", requireAdmin, upload.single("image"), updateGalleryItem);
galleryRouter.delete("/:id", requireAdmin, deleteGalleryItem);

