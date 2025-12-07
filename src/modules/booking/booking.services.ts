import { pool } from "../../config/db"

//Create a new booking with automatic price calculation and vehicle status update
const createBooking = async(payload:Record<string, unknown>, totalPrice : number)=>{
    const  {customer_id, vehicle_id, rent_start_date, rent_end_date} = payload

    const result = await pool.query(`INSERT INTO 
        bookings(
        customer_id, vehicle_id, rent_start_date, rent_end_date, total_price)
        VALUES($1,$2,$3,$4,$5) RETURNING * `, [
        customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice
    ]);

    return result

}

//Admin sees all, Customer sees own
const getAllBooking = async()=>{

}

// Update booking status based on user role and business rules
const updateBooking = async()=>{

}






export const bookingServices = {
    createBooking,
    getAllBooking,
    updateBooking
}