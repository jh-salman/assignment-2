import {  Router } from "express";
import { userControllers } from "./user.controller";
import { auth } from "../../middlewere/auth";
const router = Router();

router.post("/", userControllers.createUser)

router.get("/", userControllers.getAllUsers)

router.get("/:userId", auth("admin"), userControllers.getSingleUser)
router.put("/:userId", userControllers.updateSingleUser)



export const userRoutes = router