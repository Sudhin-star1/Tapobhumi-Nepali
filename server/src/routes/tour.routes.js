import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import { createTour, deleteTour, listTours, updateTour } from "../controllers/tour.controller.js";
import { makeCloudinaryUpload } from "../middleware/cloudinaryStorage.js";
import { removeImage, reorderImages } from "../controllers/media.controller.js";
import { Tour } from "../models/Tour.js";

export const tourRouter = Router();

tourRouter.get("/", listTours);
const tourUpload = makeCloudinaryUpload({ folder: "tours" });
tourRouter.post("/", requireAdmin, tourUpload.array("images", 10), createTour);
tourRouter.put("/:id", requireAdmin, tourUpload.array("images", 10), updateTour);
tourRouter.patch("/:id/images/remove", requireAdmin, removeImage({ Model: Tour }));
tourRouter.patch("/:id/images/reorder", requireAdmin, reorderImages({ Model: Tour }));
tourRouter.delete("/:id", requireAdmin, deleteTour);

