import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
dotenv.config();

const UserSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            min:2,
            max:100
        },
        email:{
            type:String,
            required:true,
            max:50,
            unique:true
        },
        profilePicture:{
            type:String,
            default:"https://res.cloudinary.com/drxcjij97/image/upload/v1707052827/zupx5ylgkrtq33lzzkma.png"
        },
        password:{
            type:String,
            default: "$2b$10$M62ybY2nJLxqQM0noVK49O9/eJm/8xIdE5o3pxGHGT1niVsmhj8ay",
            min:5,
        },
        refreshToken:{
            type:String,
        },
        passwordResetToken:{
            type:String,
        },
        hostel:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Hostel"
        },
        role:{
            type:String,
            enum:["student","accountant","chiefWarden"],
            default:"student",
        },
    },
    {timestamps:true}
)

UserSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            hostel: this.hostel,
            role: this.role,
            profilePicture: this.profilePicture
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.generatePasswordResetToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.PASSWORD_RESET_TOKEN_SECRET,
        {
            expiresIn: process.env.PASSWORD_RESET_TOKEN_EXPIRY
        }
    )
}

const User = mongoose.model("User",UserSchema);
export default User; 