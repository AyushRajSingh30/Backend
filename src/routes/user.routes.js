import { Router } from "express";
import { loginUser ,registerUser } from "../controllers/user.controllers.js"
import { upload } from "../middlewares/multer.middleware.js"
const router = Router();

//upload is middleware

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)

export default router;