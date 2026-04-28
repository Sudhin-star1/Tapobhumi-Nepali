import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary, configureCloudinary } from "../config/cloudinary.js";
import { HttpError } from "../utils/httpError.js";

function ensureConfigured() {
  const ok = configureCloudinary();
  if (!ok) throw new HttpError(500, "Cloudinary is not configured");
}

function fileFilter(req, file, cb) {
  const ok = /^image\/(jpeg|jpg|png|webp)$/.test(file.mimetype);
  if (!ok) return cb(new HttpError(400, "Only jpg, png, webp images are allowed"));
  return cb(null, true);
}

export function makeCloudinaryUpload({ folder }) {
  ensureConfigured();

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      resource_type: "image",
    },
  });

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 },
  });
}

