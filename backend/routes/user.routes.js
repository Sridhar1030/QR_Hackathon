// routes/userRoutes.js
import { Router } from "express";
import { signUpUser  } from "../controllers/user.controllers.js";

const userRoutes = Router();

// Define the login route
userRoutes.post("/signup", signUpUser);
// userRoutes.post("/login", loginUser);
// userRoutes.post("/adminScanQr", scanQrCode);

export { userRoutes };
