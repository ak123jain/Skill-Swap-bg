import { Router } from "express";
import { verifyjwt } from "../middlewares/auth.middleware.js";
 
import { sendTwilioToken } from "../controllers/Twillio.controller.js";


const router = Router();

router.route("/sendotp").post(
     sendTwilioToken
)

export default router;