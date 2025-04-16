import { Router } from "express";
import { getvideo, recordvideo } from "../controllers/Video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyjwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/recordvideo/:id").post(
     upload.single("video"),
     verifyjwt,
     recordvideo
)

router.route("/getvideo").get(
    verifyjwt,
    getvideo
)


export default router;