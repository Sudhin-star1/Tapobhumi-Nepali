import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { createPackage, deletePackage, getPackage, listPackages, updatePackage } from "../controllers/package.controller.js";

export const packageRouter = Router();

packageRouter.get("/", listPackages);
packageRouter.get("/:id", getPackage);
packageRouter.post("/", requireAdmin, upload.array("images", 10), createPackage);
packageRouter.put("/:id", requireAdmin, upload.array("images", 10), updatePackage);
packageRouter.delete("/:id", requireAdmin, deletePackage);

