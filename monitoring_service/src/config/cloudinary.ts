import cloudinary from "cloudinary";
import { config } from "dotenv";
import fs from "fs";
import { logger } from "./logs";
config();
cloudinary.v2.config({
  secure: true,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});
export async function uploadImage(path: string) {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
 
    const result = await cloudinary.v2.uploader.upload(path, options);

    fs.unlink(path, () => logger.info(`deleted file ${path}`));
    return result.secure_url;
  } catch (error) {
    console.error(error);
  }
}

