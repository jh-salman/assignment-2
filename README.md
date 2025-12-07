# Vehicle Rental System API

**Live URL:** <your-live-url>  
**Repository:** <your-github-repo-link>

This is a REST API for a simple vehicle rental system.  
It supports user authentication, vehicle management, and booking operations with role-based access.

---

## Features

### Authentication & Users
- Signup with email and password
- Signin and JWT token generation
- Two roles: **admin** and **customer**
- Admin can view/update all users  
- Customer can update only own profile

### Vehicles
- Admin can add, update, and delete vehicles
- Public can view all vehicles or a single vehicle
- Availability status supported:
  - `available`
  - `booked`
  - `maintenance`

### Bookings
- Customer/Admin can create bookings
- Total price is calculated automatically:
  - **daily_rent_price × number_of_days**
- Booking update rules:
  - Customer can cancel (`cancelled`)
  - Admin can mark returned (`returned`)
- Vehicle status update rules:
  - Booking created → vehicle becomes `booked`
  - Booking cancelled/returned → vehicle becomes `available`

---

## Tech Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **PostgreSQL (Neon)**
- **pg (Pool)**
- **JWT (jsonwebtoken)**
- **bcryptjs**
- **dotenv**



