import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
     fullname :{
        type : String,
        required : true
    },
    username:{
        type : String,
        required : true,
        unique : true
    },
    email:{
        type : String,
        required : true,
        unique : true
    },
    password:{
        type : String,
        required : true
    },
    avatar:{
        type : String,
        required :  false,
    },
    refreshToken:{
        type : String,
        default : null
    },

    bio:{
        type : String,
        default : null
    },
    canTeach:{
        type : [String],
        default : []
    },
    wantToLearn:{
        type : [String],
        default : []
    },
    hasCompletedProfile :{
        type : Boolean,
        default : false
    },
    availability :   [
        {
            day :{
                type : String,
                required : true
            },
            startTime :{
                type : String,
                required : true
            },
            endTime :{
                type : String,
                required : true
            }
        }
    ]
    // [{} , {}  ]
} , {
    timestamps: true,
});

userSchema.pre("save" , async function (next){
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
             {
                id : this._id,
                email : this.email,
                username : this.username,
                fullname : this.fullname,
             },
             process.env.ACCESS_TOKEN_SECRET,
             {
                expiresIn : process.env.ACCESS_TOKEN_EXPIRY
             }
    )
}

userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
             {
                id : this._id,
                email : this.email,
                username : this.username,
                fullname : this.fullname,
             },
             process.env.REFRESH_TOKEN_SECRET,
             {
                expiresIn : process.env.REFRESH_TOKEN_EXPIRY
             }
    )
}

export const User = mongoose.model("User" , userSchema)