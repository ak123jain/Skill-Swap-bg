import { asynchandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { json } from "express";
import { Video } from "../models/video.model.js";
import { Types } from "mongoose"; // Add this import


export const recordvideo = asynchandler(async (req , res) =>{

    const {id}    = req.params;

    console.log("req parammmmms" ,  req.params);
    

    console.log("req parammmmms" ,  id);
    

    console.log("req body" , req.body);


    console.log("req file" , req.file);

    const  video  = req.file.path;

    const uploadedbyId = req.user._id;

    console.log("video path" , video);


    const result = await uploadOnCloudinary(video)

    console.log("result of video upload", result);

      

    const videoo = new Video({
        sharedWith : id,
        videoUrl: result?.url,
        uploadedBy : uploadedbyId
    })

    console.log("videoo aksh jain" , videoo);
    

    await videoo.save()

     return res.status(200).json(
        new ApiResponse(
            200, 
            {videoo},
            "Video uploaded successfully"
     ))

})


export const getvideo = asynchandler(async (req , res) =>{

    console.log("req body" , req.user._id);

    const viewedId = req.user._id; 

    console.log("req body" , viewedId);

    const video = await Video.find({
          sharedWith : viewedId
    })

    console.log("video" , video);
    

    return res.status(200).json(
        new ApiResponse(
            200, 
            {video},
            "Video found successfully"
     ))

})