import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.services";


const createVehicle = async (req: Request, res: Response) => {

    const {
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status
    } = req.body;

    try {
        const result = await vehicleServices.createVehicle(
            vehicle_name,
            type,
            registration_number,
            daily_rent_price,
            availability_status
        )
        const data = result.rows[0]
        res.status(201).json({
            success: true,
            message:"Vehicle created successfully",
            data: {
                id:data.id,
                vehicle_name: data.vehicle_name,
                type: data.type,
                registration_number: data.registration_number,
                daily_rent_price: data.daily_rent_price,
                availability_status: data.availability_status
            }
        })
    }
            
        
     catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}


export const vehicleController = {
    createVehicle
}