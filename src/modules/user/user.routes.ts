import {  Router } from "express";
import { userControllers } from "./user.controller";
const router = Router();

router.post("/", userControllers.createUser)

router.get("/", userControllers.getAllUsers)



export const userRoutes = router