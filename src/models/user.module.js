import mongoose from "mongoose";
import { jwt } from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema =new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowcase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
   fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,       //cloudinary url
        required:true
    },

    coverImage:{
        typr:String       //cloudinary url
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    
    password:{
        type:String,
        required:[true, "Password is required"]
    },
    refreshToken:{
        type:String
    },
    

},{timestamps:true})

  
/*In Mongoose, pre middleware allows you to define functions that run before specific operations such as saving or updating documents in the database.Why Use it?: You can use pre middleware to perform custom actions or modify data before it gets stored in the database.*/

userSchema.pre("save",  async function(next){
//If cheak password is modifi or not if it modify then than password save and encreypt
    if(!this.isModified("password")) return next() 
    this.password=bcrypt.hash(this.password, 10)
//10 is limit
    next()
})

//this method cheak password is true or false

userSchema.method.isPasswordCorrect=async function(password){
/*pasword compare we give to input (1. user given password) && (2.bcrypt encrypt this.password)*/
return await bcrypt.compare(password, this.password)
}



// The primary purpose of a refresh token is to renew or obtain a new access token without requiring the user to log in again.


userSchema.method.generateAccessToken=async function() { 
    return jwt.sign({
    _id:this._id,
    email:this.email,
    username:this.username,
    fullName:this.fullName
},
 process.env.ACCESS_TOKEN_SECRET,
{expiresIn:process.env.ACCESS_TOKEN_EXPIRY }
)}
userSchema.method.generateRefreshToken=async function(){
    return jwt.sign({
    _id:this._id

    },
    process.env.REFRESH_TOKEN_SECRET ,

    {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
    )}

export const User =mongoose.model("User", userSchema)