import { Router } from "express";
import { bookingController } from "./booking.controller";
import { auth } from "../../middlewere/auth";

const router = Router()

router.post("/",auth("admin", "customer"), bookingController.createBooking)
router.get("/", auth("admin","customer"), bookingController.getAllBookings)
router.put("/:bookingId", bookingController.updateBooking)






export const bookingRoutes = router;