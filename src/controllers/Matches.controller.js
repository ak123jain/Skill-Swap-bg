import { ApiError } from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";



export const getMatch = asynchandler(async(req , res) =>{
    // curent user

    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    console.log("current user" , user);
    

    const {canTeach , wantToLearn } = user;

    const matches = await User.find({
        _id : { $ne : userId},
        canTeach : { $in : wantToLearn },
        wantToLearn : { $in : canTeach },
    }).select("-password");


    const match2 = await User.find({
        _id : { $ne : userId},
        wantToLearn : { $in : canTeach },
    })

    const match3 = await User.find({
        _id : { $ne : userId},
        canTeach : { $in : wantToLearn },
    })

    return res.status(200).json(new ApiResponse(200, {matches  , match2 , match3} , "Success"));

})