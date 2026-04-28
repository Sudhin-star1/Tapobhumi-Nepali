import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import { createTrek, deleteTrek, listTreks, updateTrek } from "../controllers/trek.controller.js";
import { makeCloudinaryUpload } from "../middleware/cloudinaryStorage.js";
import { removeImage, reorderImages } from "../controllers/media.controller.js";
import { Trek } from "../models/Trek.js";

export const trekRouter = Router();

trekRouter.get("/", listTreks);
const trekUpload = makeCloudinaryUpload({ folder: "treks" });
trekRouter.post("/", requireAdmin, trekUpload.array("images", 10), createTrek);
trekRouter.put("/:id", requireAdmin, trekUpload.array("images", 10), updateTrek);
trekRouter.patch("/:id/images/remove", requireAdmin, removeImage({ Model: Trek }));
trekRouter.patch("/:id/images/reorder", requireAdmin, reorderImages({ Model: Trek }));
trekRouter.delete("/:id", requireAdmin, deleteTrek);

