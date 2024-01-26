import { asynchandeler } from "../utils/asyncHandeler.js";

const registerUser= asynchandeler(async(req, res)=>{
    res.status(200).json({
        message:"ok"
    })
})

export {registerUser}