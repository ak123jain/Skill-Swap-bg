import {app} from "./app.js";
import dotenv from "dotenv";
import { connectdb } from "./db/index.js";

dotenv.config({
    path: "./env"
})

connectdb()
.then(()=> {

    const port = process.env.PORT || 5000;

    app.listen( port, () => {
        console.log(`Server is running on port ${ port }`);
    })



}).catch((err)=>{
    console.error("Database connection failed:", err.message);
    process.exit(1); // Exit the process with failure
})