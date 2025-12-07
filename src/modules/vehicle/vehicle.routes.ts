import { Router } from "express";
import { vehicleController } from "./vehicle.controller";
import { auth } from "../../middlewere/auth";

const router = Router()


router.post("/", auth("admin"), vehicleController.createVehicle)





export const vehicleRouter = router