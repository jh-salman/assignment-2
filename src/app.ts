import express, { Request, Response } from "express";
import { initDB } from "./config/db";
import { userRoutes } from "./modules/user/user.routes";
import { authRouter } from "./modules/auth/auth.routes";
import { auth } from "./middlewere/auth";
import { vehicleRouter } from "./modules/vehicle/vehicle.routes";
import { bookingRoutes } from "./modules/booking/booking.routes";

export const app = express();
//init db
initDB();

//parser

app.use(express.json())

app.get("/", (req :Request, res: Response)=>{
    res.status(200).json({
        message: "Server is running successfully",
        path: req.path
    })
})
app.use("/api/v1/auth/signup", userRoutes);

// update signle user only admin and owner
app.use("/api/v1/users", auth("admin", "customer"), userRoutes)


// Auth router

app.use("/api/v1/auth/", authRouter )


// vehicle routes

app.use("/api/v1/vehicles", vehicleRouter)


//Booking routes 

app.use("/api/v1/bookings", bookingRoutes )