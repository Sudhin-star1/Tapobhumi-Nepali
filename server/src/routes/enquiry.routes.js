import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import { createEnquiry, deleteEnquiry, listEnquiries, updateEnquiryStatus } from "../controllers/enquiry.controller.js";

export const enquiryRouter = Router();

// Public: website enquiry form
enquiryRouter.post("/", createEnquiry);

// Admin protected
enquiryRouter.get("/", requireAdmin, listEnquiries);
enquiryRouter.patch("/:id", requireAdmin, updateEnquiryStatus);
enquiryRouter.delete("/:id", requireAdmin, deleteEnquiry);

