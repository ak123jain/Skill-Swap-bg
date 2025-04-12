// import jwt from "jsonwebtoken";
// import { ApiError } from "../utils/ApiError.js";
// import { User } from "../models/user.model.js";

// export const verifyjwt = async () =>{
//     try {

//         const token1 = req.cookies.accessToken || req.header("Authorization").replace("Bearer ", "")

//         console.log("token" , token1);

        
//         const token = req.header("Authorization").replace("Bearer ", "") || req.cookies.accessToken
//         if (!token) {
//             throw new ApiError(401, "Authorization token not found");
//         }

//         const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//         const user = User.findById(decoded._id).select("-password");

        
//         if (!user) {
//             throw new ApiError(401, "User not found");
//         }
        
//         req.user = user;

//         next()

//     } catch (error) {
//         console.log("authoeartion needed " , error);
        
//     }
// }


import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const verifyjwt = async(req , _ , next) =>{
    try {


        console.log("token iiiii 💕💕",req.header("Authorization"));
        console.log("token iiiii  coookie 💕💕",req.cookies.accessToken);

         const token1 = req.cookies.accessToken || req.header("Authorization").replace("Bearer ", "")
         console.log("token 😘😘😘" , token1);

        // const token = req.header("Authorization").replace("Bearer ", "");

        if (!token1) {
            console.log("token is not found 💕💕💕 provided");
        }
        const decoded = jwt.verify(token1, process.env.ACCESS_TOKEN_SECRET);
        console.log("token is verified 😍😍😍😍😍");

        const user = await User.findById(decoded.id).select("-password -refreshtoken");

        if (!user) {
            console.log("user is not found 💕💕💕");
        }

        req.user = user;

        next();
    } catch (error) {
        throw new ApiError(401, "unauthorized beataaa😒😒😒😒")
        
    }
}