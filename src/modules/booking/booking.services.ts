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
const getAllBookings = async()=>{
const result = await pool.query(`SELECT * FROM bookings`);
return result

}

//get single booking by id
const getSingleBooking = async(bookingId:string)=>{
    const result = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [bookingId]);
    return result
}

// Update booking status based on user role and business rules
const updateBookingStatus = async (bookingId: string, status: string) => {
   const result = await pool.query(
    `
    UPDATE bookings
    SET status=$1, updated_at=NOW()
    WHERE id=$2
    RETURNING *;
    `,
    [status, bookingId]
  );

    return result;
};
const autoReturnExpiredBookings = async () => {
  const result = await pool.query(`
    UPDATE bookings
    SET status='returned', updated_at=NOW()
    WHERE status='active'
      AND rent_end_date < CURRENT_DATE
    RETURNING vehicle_id;
  `);

  return result; 
};






export const bookingServices = {
    createBooking,
    getAllBookings,
    getSingleBooking,
    updateBookingStatus,
    autoReturnExpiredBookings
}