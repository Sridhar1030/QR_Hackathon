import dotenv from "dotenv";
import { User } from "../models/user.model.js";
import AdminDashboard from "../models/admin.model.js"

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


    console.log(adminEmail);
    console.log(process.env.Admin_Email);
    
    if (adminEmail === process.env.Admin_Email) {
        try {
            const user = await User.findById(id);

            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            if (!user.meals || typeof user.meals !== "object") {
                user.meals = {
                    breakfast1: false,
                    lunch1: false,
                    snacks:false,
                    dinner: false,
                    breakfast2: false,
                    lunch2:false
                }; 	
            }

            const validMeals = ["breakfast1", "lunch1", "dinner", "breakfast2", "snacks","lunch2"];
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

            // Update the AdminDashboard meal count
            const dashboard = await AdminDashboard.findOne(); 
            if (!dashboard) {
                // Create a new dashboard entry if it doesn't exist
                const newDashboard = new AdminDashboard({
                    breakfast1Count: meal === 'breakfast1' ? 1 : 0,
                    breakfast2Count: meal === 'breakfast2' ? 1 : 0,
                    lunchCount: meal === 'lunch1' ? 1 : 0,
                    dinnerCount: meal === 'lunch2' ? 1 : 0,
                    dinnerCount: meal === 'snacks' ? 1 : 0,
                    dinnerCount: meal === 'dinner' ? 1 : 0,
                });
                await newDashboard.save();
            } else {
                // Increment the appropriate count based on the meal
                if (meal === 'breakfast1') {
                    dashboard.breakfast1Count += 1;
                } else if (meal === 'breakfast2') {
                    dashboard.breakfast2Count += 1;
                } else if (meal === 'lunch1') {
                    dashboard.lunch1Count += 1;  
                } else if (meal === 'lunch2') {
                    dashboard.lunch2Count += 1;  
                } else if (meal === 'dinner') {
                    dashboard.dinnerCount += 1;
                } else if (meal === 'snacks') {
                    dashboard.snacksCount += 1;  
                }
                await dashboard.save();
            }

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



export const getMealCounts = async (req, res) => {
    const { adminEmail } = req.body; 

    if (adminEmail !== process.env.Admin_Email) {
        return res.status(401).json({ message: "Unauthorized: Invalid admin credentials." });
    }

    try {
        const dashboard = await AdminDashboard.findOne();

        if (!dashboard) {
            return res.status(404).json({ message: "Dashboard not found." });
        }

        const totalUsers = await User.countDocuments(); 

        return res.status(200).json({
            breakfast1Count: dashboard.breakfast1Count,
            breakfast2Count: dashboard.breakfast2Count,
            lunch1Count: dashboard.lunch1Count,  
            lunch2Count: dashboard.lunch2Count,  
            dinnerCount: dashboard.dinnerCount,
            snacksCount: dashboard.snacksCount,  
            totalUsers,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error." });
    }
};
