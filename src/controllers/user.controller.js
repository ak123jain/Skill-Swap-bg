import { asynchandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { json } from "express";


const generateTokens =  async (userId)=>{

    const user = await User.findById(userId).select("-password -refreshToken")

    const accessToken = user.generateAccessToken(user._id)
    const refreshToken = user.generateRefreshToken(user._id)

    user.refreshToken = refreshToken;

    await user.save();

    console.log("user after refresh token save", user);

    return {accessToken, refreshToken};

}



export const register = asynchandler(async (req , res)=>{


    let { fullname, email, username, password  , bio , canTeach , wantToLearn , availability   } = req.body;


    console.log("req body" , req.body);
    

    if (typeof canTeach === 'string') canTeach = [canTeach];
    if (typeof wantToLearn === 'string') wantToLearn = [wantToLearn];
    // if (typeof availability === 'string') availability = JSON.parse(availability);

    if (typeof availability === "string") {
        try {
          availability = JSON.parse(availability);
        } catch (error) {
          throw new ApiError(400, "Invalid availability format");
        }
      }

        
        console.log("req body" ,  canTeach , wantToLearn , availability);

    
    if (
        [fullname, email, username, password, bio].some(field =>  field.trim() === "") ||
        !Array.isArray(canTeach) || canTeach.length === 0 ||
        !Array.isArray(wantToLearn) || wantToLearn.length === 0 ||
        !Array.isArray(availability) || availability.length === 0

      ) {
        throw new ApiError(400, "All fields are required");
      }
      

    const existinguser = await User.findOne({ email });

    if (existinguser) {
        throw new ApiError(400 , "User already exists")
    }


    const  avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar) {
        throw new ApiError(500, "Avatar upload failed");
    }

    const user = await User.create({
        fullname,
        email,
        username,
        password,
        avatar: avatar.url,
        bio,
        canTeach,
        wantToLearn,
        availability
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

     return res.status(201).json(new ApiResponse(201 , createdUser , "User created successfully"))

})

export const loggedinuser = asynchandler(async (req , res)=>{
    const { password , email } = req.body;

    console.log("req body" , req.body);
    

    if ( [password , email].some((field)=> field.trim() === "")) {
        throw new ApiError(400 , "All fields are required")
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(400 , "Invalid credentials")
    }

    console.log("user" , user);


    const ispasswordcorrect = await user.isPasswordCorrect(password)


    if (!ispasswordcorrect) {
        throw new ApiError(400 , "Invalid credentials")
    }

    const { accessToken, refreshToken } =  await generateTokens(user._id);

    const loggedin = await User.findById(user._id).select("-password")

    const options = {
        httpOnly: true,
        secure: false,
        
        sameSite: "Lax", // Adjust as needed for cross-site requests
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      };
    

       return res.status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(
            201, 
            {
                user :  loggedin,
                accessToken,
                refreshToken
            },
            "User logged in successfully"
        )
    )

})

export const Logoutuser = asynchandler( async (req , res) =>{

    await User.findByIdAndUpdate(req.user._id , {
        $unset :{
            refreshToken : 1
        }
    } , {new : true})

    console.log("after removing the refresh token" , req.user);

     const options = {
        httpOnly: true,
        secure:  false,
        sameSite: 'lax',
      };

      return res.status(200)
      .clearCookie("refreshToken", options)
      .clearCookie("accessToken", options)
        .json(
            new ApiResponse(
                200, 
                {},
                "User logged out successfully"
            )
        )


})

export const RefreshAccestoken = asynchandler(async (req , res) =>{

    const { refreshToken } = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new ApiError(401, "Refresh token is required");
    }

    const decoded = jwt.verify( refreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (!decoded) {
        throw new ApiError(401, "Invalid refresh token");
    }

    const user = await User.findById(decoded.id);

    if (!user) {
        throw new ApiError(401, "User not found");
    }

    if (user.refreshToken !== refreshToken) {
        throw new ApiError(401, "Invalid refresh token");
    }

    const { accessToken , newRefreshToken } = await generateTokens(user._id);

    const options = {
        httpOnly: true,
        secure:  true,
    }

    return res.status(200)
    .cookie("refreshToken", newRefreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                accessToken,
                refreshToken : newRefreshToken
            },
            "Token refreshed successfully"
        )
    )
})


export const updatedetails = asynchandler( async ( req , res) =>{

    const { fullname, email, username } = req.body;

    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(userId , {
        $set:{
            fullname: fullname,
            username: username,
            email: email,
        }
    } , {new : true}).select("-password")


    if (!user) {
        throw new ApiError(404, "User not found");
    }

     return res.status(200).json(
        new ApiResponse(
            200, 
            user,
            "User updated successfully"
        )
    )


})


export const updateavatar = asynchandler(async(req , res)=>{
    const userid = req.user._id;

    const avatarlocalpath = req.files?.avatar[0]?.path;

    if (!avatarlocalpath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarlocalpath);

    if (!avatar) {
        throw new ApiError(500, "Something went wrong while uploading the avatar");
    }

    const user = await User.findByIdAndUpdate(
        userid,
        {
            $set: {
                avatar: avatar.url,
            },
        },
        { new: true }
    ).select("-password");

    return res.status(201).json(
        new ApiResponse(201, user, "Avatar updated successfully")
    )
})

export const changecurrentpassword = asynchandler(async(req , res)=>{
    const {password , newpassword } = req.body;

    if (!password || !newpassword) {
        throw new ApiError(400, "All fields are required");
    }

    const userId = req.user._id;

    const user = await User.findById(userId).select("+password");

    const ispasswordcorrect  = await user.isPasswordCorrect(password);

    if (!ispasswordcorrect) {
        throw new ApiError(401, "Invalid password");
    }

    user.password = newpassword;

    await user.save();

    await user.save({validateBeforeSave:  true});

    return res.status(201).json(
        new ApiResponse(201, {} , "Password changed successfully")
    )

})

 

export const getuserbyid = asynchandler(async (req , res) =>{

    const userId = req.params.id;

    const user = await User.findById(userId).select("-password")

    if (!user) {
        throw new ApiError(404, "User not found");
    }

     return res.status(200).json(
        new ApiResponse(
            200, 
            {user},
            "User fetched successfully"
        )
    )
})

export const getuser = asynchandler(async (req , res) =>{
 
    const user = await User.find({}).select("-password -refreshToken -username")

    if (!user) {
        throw new ApiError(404, "User not found");
    }

     return res.status(200).json(
        new ApiResponse(
            200, 
            {user},
            "User fetched successfully"
        )
    )
})

