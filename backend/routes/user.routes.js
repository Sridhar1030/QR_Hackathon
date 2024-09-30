// routes/userRoutes.js
import { Router } from "express";
import {
    signUpUser,
    loginUser,
    getUser,
    getTeamDetailsByTeamName,
    getUserDetailsById,
} from "../controllers/user.controllers.js";
import {
    adminScan,
    getMealCounts,
} from "../controllers/adminScan.controller.js";

const userRoutes = Router();

// Define the login route
userRoutes.post("/signup", signUpUser);
userRoutes.post("/login", loginUser);
userRoutes.get("/userDetails/:id", getUser);
userRoutes.post("/getTeamDetailsByTeamName", getTeamDetailsByTeamName);
userRoutes.post("/scan", adminScan);
userRoutes.post("/getMealCounts", getMealCounts);
userRoutes.get("/getUserDetailsById/:_id", getUserDetailsById);

export { userRoutes };
