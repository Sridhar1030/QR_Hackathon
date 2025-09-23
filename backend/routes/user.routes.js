// routes/userRoutes.js
import { Router } from "express";
import {
    signUpUser,
    loginUser,
    getUser,
    getTeamDetailsByTeamName,
    getUserDetailsById,
    getAllUser,
} from "../controllers/user.controllers.js";
import {
    adminScan,
    getMealCounts,
} from "../controllers/adminScan.controller.js";
import { getSelectedTeams } from "../controllers/team.controllers.js";
import {Team} from "../models/team.models.js";

const userRoutes = Router();
userRoutes.get("/selected-teams", getSelectedTeams);

// Define the login route
userRoutes.post("/signup", signUpUser);
userRoutes.post("/login", loginUser);
userRoutes.get("/userDetails/:id", getUser);
userRoutes.post("/getTeamDetailsByTeamName", getTeamDetailsByTeamName);
userRoutes.post("/scan", adminScan);
userRoutes.post("/getMealCounts", getMealCounts);
userRoutes.get("/getUserDetailsById/:_id", getUserDetailsById);
userRoutes.post("/getAllUser" , getAllUser)
userRoutes.get("/selected-teams", getSelectedTeams);
// userRoutes.get("/selected-teams", async (req, res) => {
//     try {
//         const teams = await Team.find({ isSelected: true }).select("name -_id");
//         const teamNames = teams.map(team => team.name);
//         res.status(200).json({ teamNames });
//     } catch (err) {
//         res.status(500).json({ message: "Server error fetching selected teams", error: err.message });
//     }
// });

export { userRoutes };
