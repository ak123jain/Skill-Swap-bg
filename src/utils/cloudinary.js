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

         fs.unlinkSync(localFilePath); // Delete the local file after upload    

        return response;

    } catch (error) {
        console.error("⚠️ Error during file upload:", error);

         fs.unlinkSync(localFilePath); // Delete the local file after upload failure

        return null;
    }
};

export { uploadOnCloudinary };
