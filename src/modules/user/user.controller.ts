import { Request, Response } from "express"
import { userServices } from "./user.services"

const createUser = async(req:Request, res: Response)=>{
    try {
        
        const result = await userServices.createUser(req.body)

        const {id, name, email, phone, role} = result.rows[0]

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id,
                name,
                email,
                phone,
                role
            }
        })
    } catch (error :any) {

        res.status(500).json({
            success: false,
            message: error.message
        })
        
    }
}



//Get All Users


const getAllUsers = async(req:Request, res:Response)=>{
    

    try {
        const result = await userServices.getAllUsers();
        console.log(result)

        if(result.rows.length === 0){
            res.status(404).json({
                success:false,
                message: "No user found",
                data:[]

            })
        }

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows.map(({id, name, email, phone, role})=>({
                id,
                name,
                email,
                phone,
                role

            }))

            })
            
    
        
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const userControllers = {
    createUser,
    getAllUsers
}