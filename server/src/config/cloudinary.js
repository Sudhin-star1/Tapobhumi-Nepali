import cloudinaryPkg from "cloudinary";
import { env } from "./env.js";

const cloudinary = cloudinaryPkg.v2 ?? cloudinaryPkg;

export function configureCloudinary() {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    return false;
  }

  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });

  return true;
}

export { cloudinary };

