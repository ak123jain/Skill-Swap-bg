import { Router } from "express";
import { verifyjwt } from "../middlewares/auth.middleware.js";
import { getMatch } from "../controllers/Matches.controller.js";


const router = Router();

router.route("/getmatch").get(
    verifyjwt,
    getMatch
)

router.route

export default router;