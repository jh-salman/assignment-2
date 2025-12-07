import { Pool } from "pg";
import { config } from ".";

export const pool = new Pool({
    connectionString: `${config.connectionDb}`
})

export const initDB = async () => {


    await pool.query(`
     CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(200) UNIQUE NOT NULL CHECK (email = lower(email)),
        password TEXT NOT NULL CHECK (LENGTH(password) >= 6),
        phone VARCHAR(20) NOT NULL,
        role VARCHAR(50) CHECK (role IN ('customer','admin')) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        );
        
        `)

    await pool.query(`
     CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(150) NOT NULL,
        type VARCHAR(30) NOT NULL CHECK (type IN ('car', 'bike', 'van','suv')),
        registration_number VARCHAR(200) NOT NULL UNIQUE,
        daily_rent_price NUMERIC(10,2) NOT NULL CHECK (daily_rent_price > 0),
        availability_status VARCHAR(50) NOT NULL
        CHECK (availability_status IN ('available','booked')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date	DATE NOT NULL ,
        rent_end_date DATE NOT NULL CHECK (rent_end_date>rent_start_date),
        total_price NUMERIC(10,2) NOT NULL CHECK (total_price>0),
        status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'cancelled','returned')) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()   
       );
    `)


}