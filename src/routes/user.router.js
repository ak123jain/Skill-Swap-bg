import { Router } from "express";
import { getuser, getuserbyid, loggedinuser, Logoutuser, register, updateavatar, updatedetails } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(upload.single("avatar") , register)


router.route("/login").post(
    upload.any(),
    loggedinuser)

    
router.route("/logout").post(
    upload.any(),
    Logoutuser)


router.route("/updatedetails").patch(
    updatedetails
)    

router.route("/updateavatar").patch(
    upload.single("image"),
     updateavatar
)

router.route("/getuserbyId/:id").get(
    getuserbyid 
)

router.route("/getuser").post(
    getuser
)



export default router;