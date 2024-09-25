import dotenv from "dotenv";
import { User } from "../models/user.model.js";

dotenv.config();

// // Function to determine the current meal time based on time of the day
// const getCurrentMealTime = () => {
// 	const now = new Date();
// 	const currentHour = now.getHours();
// 	const currentMinute = now.getMinutes();
// 	const currentTime = currentHour * 60 + currentMinute; // Convert time to minutes for easier comparison

// 	// Define meal time ranges in minutes
// 	const breakfast1Start = 10 * 60; // 10:00 AM
// 	const breakfast1End = 11 * 60 + 30; // 11:30 AM
// 	const lunchStart = 13 * 60; // 1:00 PM
// 	const lunchEnd = 15 * 60; // 3:00 PM
// 	const dinnerStart = 21 * 60; // 9:00 PM
// 	const dinnerEnd = 23 * 60; // 11:00 PM

// 	// Check the current time against meal times
// 	if (currentTime >= breakfast1Start && currentTime < breakfast1End) {
// 		return "breakfast1";
// 	} else if (currentTime >= lunchStart && currentTime < lunchEnd) {
// 		return "lunch";
// 	} else if (currentTime >= dinnerStart && currentTime < dinnerEnd) {
// 		return "dinner";
// 	}
// 	return "breakfast2"; // For testing purposes warna null aega
// };

export const adminScan = async (req, res) => {
	const { adminEmail, id, meal } = req.body;


	console.log(adminEmail)
	console.log(process.env.Admin_Email)
	if (adminEmail === process.env.Admin_Email) {
		try {
			const user = await User.findById(id );

			if (!user) {
				return res.status(404).json({ message: "User not found." });
			}

			if (!user.meals || typeof user.meals !== "object") {
				user.meals = {
					breakfast1: false,
					lunch: false,
					dinner: false,
				};
			}

			const validMeals = ["breakfast1", "lunch", "dinner", "breakfast2"];
			if (!validMeals.includes(meal)) {
				return res.status(400).json({ message: "Invalid meal type" });
			}

			if (user.meals[meal] === true) {
				return res.status(201).json({
					message: `User has already scanned for ${meal}.`,
				});
			}

			user.meals[meal] = true;
			await user.save();

			const username = user.username;
			return res.status(200).json({
				message: `Meal scanned successfully for ${username}.`,
				meal,
			});
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Server error." });
		}
	} else {
		return res.status(401).json({ message: "Invalid admin credentials." });
	}
};
