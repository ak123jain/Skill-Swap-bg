import { Router } from "express";
import { booksession, getAllSessions } from "../controllers/session.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyjwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/booksession/:id").post(
    upload.any(),
    verifyjwt,
    booksession
)

router.route("/getsession/:id").get(
    getAllSessions
)



export default router;