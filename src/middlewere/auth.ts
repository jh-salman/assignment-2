import { NextFunction, Request, Response } from "express";
import  jwt, { JwtPayload }  from "jsonwebtoken";
import { config } from "../config";



export const auth = (...roles : string[])=>{
    return async(req: Request, res: Response, next: NextFunction)=>{

        try {
            const token = req.headers.authorization;

            const actualToken = token?.startsWith("Bearer ")? token.split(" ")[1]:token;

            if(!actualToken){
                return res.status(401).json({
                    success:false,
                    message: "Unauthorized token missing!!"
                })
            }
            const decorded = jwt.verify(actualToken as string, config.jwtSecret as string) as JwtPayload;
            

            req.user = decorded

            console.log(req.user)

            if(roles.length >0 && !roles.includes(decorded.role)){
                return res.status(403).json({
                    success:false,
                    error: "Forbidden: you don't have permission!"
                })
            }

            next()
            

        } catch (error:any) {
            res.status(401).json({
                success: false,
                message:error.message,
                details:"Unauthorized: invalid or expired token"
            })
        }

    }
}