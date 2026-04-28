import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { env } from "./config/env.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

import { authRouter } from "./routes/auth.routes.js";
import { packageRouter } from "./routes/package.routes.js";
import { serviceRouter } from "./routes/service.routes.js";
import { trekRouter } from "./routes/trek.routes.js";
import { tourRouter } from "./routes/tour.routes.js";
import { galleryRouter } from "./routes/gallery.routes.js";
import { contactRouter } from "./routes/contact.routes.js";
import { enquiryRouter } from "./routes/enquiry.routes.js";
import { expertRouter } from "./routes/expert.routes.js";

export const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(",").map((s) => s.trim()),
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRouter);
app.use("/api/packages", packageRouter);
app.use("/api/services", serviceRouter);
app.use("/api/treks", trekRouter);
app.use("/api/tours", tourRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/contact", contactRouter);
app.use("/api/enquiries", enquiryRouter);
app.use("/api/experts", expertRouter);

app.use(notFound);
app.use(errorHandler);

