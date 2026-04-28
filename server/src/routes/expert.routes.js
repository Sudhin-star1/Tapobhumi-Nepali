import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import { makeCloudinaryUpload } from "../middleware/cloudinaryStorage.js";
import { createExpert, deleteExpert, listExperts, updateExpert } from "../controllers/expert.controller.js";

export const expertRouter = Router();

const upload = makeCloudinaryUpload({ folder: "experts" });

expertRouter.get("/", listExperts);
expertRouter.post("/", requireAdmin, upload.single("image"), createExpert);
expertRouter.put("/:id", requireAdmin, upload.single("image"), updateExpert);
expertRouter.delete("/:id", requireAdmin, deleteExpert);

