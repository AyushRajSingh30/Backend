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

  
userSchema.pre("save",  async function(next){
//if cheak password is modifi or not if it modify then than password save and encreypt
    if(!this.isModified("password")) return next() 
    this.password=bcrypt.hash(this.password, 10)
//10 is limit
    next()
})
//this method cheak password is true or false
userSchema.method.isPasswordCorrect=async function(password){
    //password is given by user  and this.password is encreypt password 
return await bcrypt.compare(password, this.password)
}

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