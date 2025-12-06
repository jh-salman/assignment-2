import express, { Request, Response } from "express";
import { initDB } from "./config/db";
import { userRoutes } from "./modules/user/user.routes";

export const app = express();
//init db
initDB();

//parser

app.use(express.json())

app.get("/", (req :Request, res: Response)=>{
    res.status(200).json({
        message: "Server is running successfully",
        path: req.path
    })
})
app.use("/api/v1/auth/signup", userRoutes);

//login route 

app.use("/api/v1/users", userRoutes)
