import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import { createService, deleteService, listServices, updateService } from "../controllers/service.controller.js";

export const serviceRouter = Router();

serviceRouter.get("/", listServices);
serviceRouter.post("/", requireAdmin, createService);
serviceRouter.put("/:id", requireAdmin, updateService);
serviceRouter.delete("/:id", requireAdmin, deleteService);

