import bcrypt from "bcryptjs";
import { pool } from "../../config/db";


const createUser = async(payload : Record<string, unknown>)=>{
    const {name, email, password, phone, role} = payload;

    const hashPassword = await bcrypt.hash(password as string, 10 )

    const result = await pool.query(`INSERT INTO users(name, email, password, phone, role) VALUES($1,$2,$3,$4,$5) RETURNING * `, [name, email, hashPassword, phone, role]);
        
    return result;
}



//get All users

const getAllUsers = async()=>{

    const result = await pool.query(`SELECT * FROM users`);

    return result

}

const getSingleUser = async(userId: string)=>{
    const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [userId]);
    return result
}

// update single user
const updateSingleUser = async(name:string, email:string, phone:string,role:string, userId: string)=>{

    const result = await pool.query(`UPDATE users SET name=$1, email=$2, phone=$3, role=$4 ,updated_at=NOW() WHERE id=$5 RETURNING *  `, [name,email,phone,role,userId])
    return result
}

export const userServices = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateSingleUser
}