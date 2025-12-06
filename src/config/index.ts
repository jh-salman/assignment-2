import dotenv from "dotenv";
import path from "path";
dotenv.config({path:path.join(process.cwd(),".env")})

export const config = {
    port:process.env.PORT,
    connectionDb:process.env.CONNECTION_DB,
    jwtSecret:process.env.JWT_SECRET
}