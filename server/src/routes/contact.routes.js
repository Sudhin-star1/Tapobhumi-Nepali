import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import { getContactInfo, updateContactInfo } from "../controllers/contact.controller.js";

export const contactRouter = Router();

contactRouter.get("/", getContactInfo);
contactRouter.put("/", requireAdmin, updateContactInfo);

