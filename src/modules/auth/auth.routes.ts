import { Router } from "express";
import { authController } from "./auth.controller";
const router = Router();

router.post("/signin", authController.signinUser)



export const authRouter = router