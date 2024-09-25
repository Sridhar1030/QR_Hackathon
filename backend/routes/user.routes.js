// routes/userRoutes.js
import { Router } from "express";
import { signUpUser , loginUser } from "../controllers/user.controllers.js";
import { adminScan } from "../controllers/adminScan.controller.js";

const userRoutes = Router();

// Define the login route
// userRoutes.post("/signup", signUpUser);
userRoutes.post("/login", loginUser);


userRoutes.post('/scan', adminScan);

export { userRoutes };
