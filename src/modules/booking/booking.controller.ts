import { Request, Response } from "express";
import { bookingServices } from "./booking.services";
import { userServices } from "../user/user.services";
import { vehicleServices } from "../vehicle/vehicle.services";

//Create a new booking with automatic price calculation and vehicle status update
const createBooking = async (req: Request, res: Response) => {

    try {



        //Protected from invalid customer id and invalid vehicle id
        const requestedVehicleId = req.body.vehicle_id as number;
        const requestedCustomerId = req.body.customer_id as number;

        const existingUser = await userServices.getSingleUser(requestedCustomerId.toString());
        if (existingUser.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            })
        }

        //Validate vehicle exist
        const existingVehicle = await vehicleServices.getSingleVehicle(requestedVehicleId.toString());
        if (existingVehicle.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            })
        }

        if (existingVehicle.rows[0].availability_status !== "available") {
            return res.status(400).json({
                success: false,
                message: "Vehicle not available for booking"
            });
        }

        //Calculate total price

        const calculateTotalPrice = (dailyRentPrice: number, startDate: string, endDate: string) => {
            const start = new Date(startDate);
            const end = new Date(endDate);
            console.log(end)
            console.log(start)
            console.log(end.getTime() - start.getTime())

            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

            console.log(days)

            if (days <= 0) throw new Error("End date must be after start date");

            return dailyRentPrice * days;
        };

        const totalPrice = calculateTotalPrice(
            existingVehicle.rows[0].daily_rent_price,
            req.body.rent_start_date,
            req.body.rent_end_date
        )


        const result = await bookingServices.createBooking(req.body, totalPrice);


        const vehicleId = existingVehicle.rows[0].id.toString();
        const updatedVehicleStatus = await vehicleServices.updateVehicleStatus(vehicleId, "booked");

        console.log("Vehicle status updated:", updatedVehicleStatus.rows[0]);


        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result.rows[0]
        }
        )




    } catch (error: any) {

        res.status(500).json({
            success: false,
            message: error.message
        })

    }

}
//Admin sees all, Customer sees own
const getAllBooking = async (req: Request, res: Response) => {

}

// Update booking status based on user role and business rules
const updateBooking = async (req: Request, res: Response) => {

}


export const bookingController = {
    createBooking,
    getAllBooking,
    updateBooking
}