import { Request, Response } from "express"
import { authServices } from "./auth.service"

const signinUser = async(req : Request, res:Response)=>{

   const {email, password} = req.body


    try {

        const result = await authServices.signinUser(email , password);
         res.status(200).json(({
                success: true,
                message: "Signin successful",
                data: result
            }))
        
    } catch (error: any) {

        res.status(400).json({
            success: false,
            message:error.message,
            details:"Signin unsuccessful"
        })
        
    }

}





export const authController = {
    signinUser
}