import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken"
import { config } from "../../config";

const signinUser = async (email: string, password: string)=>{

    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
   
    if(result.rows.length === 0){
        throw new Error("Invalid email or password");
    }
    const user = result.rows[0]


    const isMatch = await bcrypt.compare(password, user.password);
    
    if(!isMatch){
        throw new Error("Invalid email or password");
    }

    

    const token = jwt.sign(
        {id:user.id,name:user.name,email:user.email,phone:user.phone,role:user.role}, 
        config.jwtSecret as string,
        {expiresIn:"7d"})

        delete user.password

    return {token, user}
     
}



export const authServices = {
    signinUser
}