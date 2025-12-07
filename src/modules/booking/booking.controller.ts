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
const getAllBookings = async (req: Request, res: Response) => {
    try {
        const loggedUser = req.user as Record<string, any>;
        const role = loggedUser.role;
        const userId = loggedUser.id;

        const result = await bookingServices.getAllBookings();
        const rows = result.rows;
   
        if (role === "admin") {
            const adminData = rows.map((b: any) => ({
                id: b.id,
                customer_id: b.customer_id,
                vehicle_id: b.vehicle_id,
                rent_start_date: b.rent_start_date,
                rent_end_date: b.rent_end_date,
                total_price: b.total_price,
                status: b.status,
                customer: {
                    name: b.customer_name,
                    email: b.customer_email,
                },
                vehicle: {
                    vehicle_name: b.vehicle_name,
                    registration_number: b.registration_number,
                },
            }));

            return res.status(200).json({
                success: true,
                message: "Bookings retrieved successfully",
                data: adminData,
            });
        }

      
        if (role === "customer") {
            const ownBookings = rows.filter((b: any) => b.customer_id === userId);
            if (ownBookings.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: "No bookings found for this customer",
                    data: [],
                });
            }

            const customerData = ownBookings.map((b: any) => ({
                id: b.id,
                vehicle_id: b.vehicle_id,
                rent_start_date: b.rent_start_date,
                rent_end_date: b.rent_end_date,
                total_price: b.total_price,
                status: b.status,
                vehicle: {
                    vehicle_name: b.vehicle_name,
                    registration_number: b.registration_number,
                    type: b.type,
                },
            }));

            return res.status(200).json({
                success: true,
                message: "Your bookings retrieved successfully",
                data: customerData,
            });
        }

        
        return res.status(403).json({
            success: false,
            message: "Forbidden: you don't have permission",
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Update booking status based on user role and business rules
const updateBooking = async (req: Request, res: Response) => {

}


export const bookingController = {
    createBooking,
    getAllBookings,
    updateBooking
}