import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.log("❌ No local file path provided. Skipping upload.");
            return null;
        }

        // Log that upload is starting
        console.log("🚀 Starting upload for local file path:", localFilePath);

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log("✅ File uploaded successfully to Cloudinary:", response.url);

        return response;

    } catch (error) {
        console.error("⚠️ Error during file upload:", error);

        if (localFilePath) {
            fs.unlinkSync(localFilePath); // Clean up the file if it exists
            console.log("🧹 Local file deleted after failed upload.");
        }

        return null;
    }
};

export { uploadOnCloudinary };
