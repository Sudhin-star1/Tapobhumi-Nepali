import { configureCloudinary, cloudinary } from "../config/cloudinary.js";
import { HttpError } from "./httpError.js";

export async function uploadBufferToCloudinary(buffer, { folder, publicId, resourceType = "image" } = {}) {
  const configured = configureCloudinary();
  if (!configured) throw new HttpError(500, "Cloudinary is not configured");

  return await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );
    stream.end(buffer);
  });
}

