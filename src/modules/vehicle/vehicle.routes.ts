import { Router } from "express";
import { vehicleController } from "./vehicle.controller";
import { auth } from "../../middlewere/auth";

const router = Router()


router.post("/", auth("admin"), vehicleController.createVehicle)
router.get("/:vehicleId", vehicleController.getSingleVehicle)
router.put("/:vehicleId", auth("admin"), vehicleController.updateVehicle)
router.delete("/:vehicleId", auth("admin"), vehicleController.deleteVehicle)
router.get("/", vehicleController.getAllVehicles)





export const vehicleRouter = router