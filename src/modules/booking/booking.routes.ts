import { Router } from "express";
import { bookingController } from "./booking.controller";
import { auth } from "../../middlewere/auth";

const router = Router()

router.post("/",auth("admin", "customer"), bookingController.createBooking)
router.get("/", bookingController.getAllBooking)
router.put("/:bookingId", bookingController.updateBooking)






export const bookingRoutes = router;