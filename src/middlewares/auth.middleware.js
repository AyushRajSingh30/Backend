import { asynchandeler } from "../utils/asyncHandeler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.module.js"
export const verifyJWT = asynchandeler(async (req, res, next) => {
    try {
        //rew.header is a method to access accessToken like Authorization: Bearer <token>
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        //provide key(ACCESS_TOKEN_SECRET) to jws for access data of jwt like id, email etc.
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        //In user have all jwt value like id  etc.
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            //discus about frontend
            throw new ApiError(401, "invalid Access Token")
        }
        //hear we add user method in req like method in object

        req.user = user;
        next()
    } catch (error) {

        throw new ApiError(401, error?.message || "Invalid")
    }

})