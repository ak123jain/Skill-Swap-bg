import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectdb = async () =>{
    try {
        console.log("\nConnecting to MongoDB...");

       
        
        const connectInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`\n MONGODB CONNECTED || DB HOST ${connectInstance.connection.host}`);
    } catch (error) {
        console.error("❌ Database connection failed:");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        console.error("Full Error:", error);
        console.error("Database connection failed:", error);
        process.exit(1); // Exit the process with failure
        
    }
}