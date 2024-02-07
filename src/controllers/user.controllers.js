import { asynchandeler } from "../utils/asyncHandeler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.module.js"
import {uplodeOnCloudinary} from "../utils/cloudnary.js"
import {ApiResponce} from "../utils/ApiResponce.js"
import { application } from "express";




const registerUser= asynchandeler(async(req, res)=>{
  /*  // get user detail from frontend
    // validation - not empty
    // cheak if user is already exists:username or email
    // cheak for images, cheak for avatar
    // upload them to cloudinary, avatar
    // creat user object - create entry in db
    // remove password and refrese token field from response
    // cheak for user creation 
    // return responce   */


    //take detail for body and destructure
   const {fullName, email, username, password}= req.body
   console.log("email:",email);

  /* //first method o cheak validation do also for all fullName, email etc
   if(fullName==""){
    throw new ApiError(400,"fullname is required")
   }    */

   //Second Method for cheak validation by using Some method it give true or false values
            
     if([fullName, email, username, password].some((field)=>field?.trim()==="")){
       throw new ApiError(400,"All field are required")
     }

     //cheak user exist or not find and findone both are all most same 
    const existedUser= User.findOne({
      $or: [ { username }, { email} ]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists")
    }


           // If req.files is available and not null or undefined, it proceeds to access the avatar property of req.files. Then, it accesses the first element [0] of the avatar req.files given by multter

    //avatarLocalPath store multer path of avatar
   const avatarLocalPath= req.files?.avatar[0].path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path;
  
    if(!avatarLocalPath){
      throw new ApiError(400, "Avatar file is required")
    }

   const avatar=await uplodeOnCloudinary(avatarLocalPath); 
   const coverImage=await uplodeOnCloudinary(coverImageLocalPath);

   if(!avatar){
    throw new ApiError(400,"Avatar file is required")
   }


//creat user and entry in db
   const user= await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase(),

   })


   //cheak user is avilable if avilable than apply select method and write which value you not want

    const createdUser =await User.findById(user._id).select(
      "-password -refreshToken"
    )

         if(!createdUser){
          throw new ApiError(500, "Something went wrong while request the user")
         }
         
         return  res.status(201).json(
          new ApiResponce(200, createdUser, "User resisterd Successfully")
         )



})





// const registerUser= asynchandeler(async(req, res)=>{
//     res.status(200).json({
//         message:"ok"
//     })
// })

export {registerUser}