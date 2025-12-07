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
            message: "Vehicle created successfully",
            data: {
                id: data.id,
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
const getSingleVehicle = async (req: Request, res: Response) => {

    const vehicleId = req.params.vehicleId as string;

    try {
        const result = await vehicleServices.getSingleVehicle(vehicleId);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            })
        }
        const data = result.rows[0]

        res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: {
                id: data.id,
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
const updateVehicle = async (req: Request, res: Response) => {

    // const {
    //     vehicle_name,
    //     type,
    //     registration_number,
    //     daily_rent_price,
    //     availability_status
    // } = req.body;

    const vehicleId = req.params.vehicleId as string;

    try {
        const existingResult = await vehicleServices.getSingleVehicle(vehicleId);
        if (existingResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            })
        }
        const vehicle_name = req.body.vehicle_name as string || existingResult.rows[0].vehicle_name;
        const type = req.body.type as string || existingResult.rows[0].type;
        const registration_number = req.body.registration_number as string || existingResult.rows[0].registration_number;
        const daily_rent_price = req.body.daily_rent_price as number || existingResult.rows[0].daily_rent_price;
        const availability_status = req.body.availability_status as string || existingResult.rows[0].availability_status;

        const result = await vehicleServices.updateVehicle(
            vehicleId,
            vehicle_name,
            type,
            registration_number,
            daily_rent_price,
            availability_status
        )
        const data = result.rows[0]

        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: {
                id: data.id,
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

const deleteVehicle = async (req: Request, res: Response) => {

    const vehicleId = req.params.vehicleId as string;

    try {
        const existingResult = await vehicleServices.getSingleVehicle(vehicleId);
        if (existingResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            })
        }

        await vehicleServices.deleteVehicle(vehicleId);

        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully"
        })
    }
    catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}
const getAllVehicles = async (req: Request, res: Response) => {

    try {
        const result = await vehicleServices.getAllVehicles();

        res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
            data: result.rows.map(({ id, vehicle_name, type, registration_number, daily_rent_price, availability_status }) => ({
                id,
                vehicle_name,
                type,
                registration_number,
                daily_rent_price,
                availability_status
            }))

        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }

};



export const vehicleController = {
    createVehicle,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle,
    getAllVehicles,

}