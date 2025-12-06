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
const getSingleUser = async(req:Request, res:Response)=>{
    try {
        const userId = req.params.userId as string;

        const result = await userServices.getSingleUser(userId);

        if(result.rows.length === 0){
            return res.status(404).json({
                success:false,
                message: "User not found"
            })
        }

        const user = result.rows[0];

        res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        })
        
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message:error.message
        })
    }
}

// update single user

const updateSingleUser = async(req:Request, res:Response)=>{
    try {
       

        const userId = req.params.userId as string;

        const loggedInuser = req.user as any;
        const loggedInUserID = String(loggedInuser.id);
        const loggedInUserRole =loggedInuser.role;

   

        if(loggedInUserRole !== "admin" && loggedInUserID !== String(userId)){
            return res.status(403).json({
                success:false,
                message: "Forbidden:Only admin or owner can update the profile"
            })
        }

        const existingResult = await userServices.getSingleUser(userId); 
        if(existingResult.rows.length === 0){
            return  res.status(404).json({
                success:false,
                message: "User not found"
            })
        }
        const existingUser = existingResult.rows[0];

        const name = req.body.name || existingUser.name;
        const email = req.body.email || existingUser.email;
        const phone = req.body.phone || existingUser.phone;
        const role = req.body.role || existingUser.role;
        
        const result = await userServices.updateSingleUser(name,email,phone,role,userId);
        
        const updateduser = result.rows[0];

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: {
                id: updateduser.id,
                name: updateduser.name,
                email: updateduser.email,
                phone: updateduser.phone,
                role: updateduser.role
            }
        })
        
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message:error.message
        })
    }
}

export const userControllers = {
    createUser,
    getAllUsers,
    updateSingleUser,
    getSingleUser
}