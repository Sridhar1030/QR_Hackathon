import { User } from "../models/user.model.js";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { json } from "express";
import { sendEmail } from "../utils/sendmail.js";
import { Team } from "../models/team.models.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        // Generate access token and refresh token
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save the refresh token in the database
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error generating tokens:", error);
        throw new Error(
            "Something went wrong while generating refresh and access tokens."
        );
    }
};

// Controller for signing up users from a team in DB
export const signUpUser = async (req, res) => {
    const { teamName, adminEmail } = req.body;

    if (adminEmail !== process.env.Admin_Email) {
        return res.status(401).json({ message: "Unauthorized access." });
    }

    try {
        // Find the team in MongoDB
        const team = await Team.findOne({ name: teamName }).populate("members");
        if (!team) {
            return res.status(404).json({ message: "Team not found." });
        }

        // Loop through each member
        for (const member of team.members) {
            // Skip if user already exists
            const existingUser = await User.findOne({ email: member.email });
            if (existingUser) continue;

            // Generate password from phone number
            const phone = member.phoneNumber;
            const firstTwo = phone.substring(0, 2);
            const middleIndex = Math.floor(phone.length / 2);
            const middleTwo = phone.substring(middleIndex - 1, middleIndex + 1);
            const lastTwo = phone.substring(phone.length - 2);
            const password = firstTwo + middleTwo + lastTwo;

            // Create new user
            const newUser = new User({
                username: member.username || member.name,
                email: member.email,
                phoneNumber: member.phoneNumber,
                github: member.github,
                college: member.college,
                gender: member.gender,
                teamName: teamName,
                password: password,
            });

            // Save user to DB
            await newUser.save();

            // Send email
            sendEmail(member.email, password, member.username || member.name)
                .then(console.log)
                .catch(console.error);
        }

        return res.status(201).json({ message: "Users created and emails sent successfully." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error." });
    }
};


// Controller for logging in a user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    const adminEmail = process.env.Admin_Email.split(",");
    if (adminEmail.includes(email) && password === process.env.ADMIN_PASSWORD) {
        return res
            .status(200)
            .json({ message: "Admin login successful", role: "admin", email });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        const isMatch = await user.checkPassword(password); // Ensure it's async
        if (!isMatch) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        const { accessToken, refreshToken } =
            await generateAccessTokenAndRefreshToken(user._id);

        return res.status(200).json({
            message: "User logged in successfully!",
            user,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error("Error logging in user:", error); // Log detailed error
        res.status(500).json({
            message: "Server error while logging in user.",
        });
    }
};



export const getTeamDetailsByTeamName = async (req, res) => {
  try {
    const { teamName } = req.body;

    const team = await Team.findOne({ name: teamName })
      .populate("members", "fname lname email") // get member details
      .populate("leader", "fname lname email");

    if (!team) return res.status(404).json({ message: "Team not found" });

    // create name field for each member
    const membersWithName = team.members.map((m) => ({
      name: `${m.fname} ${m.lname}`,
      email: m.email,
    }));

    res.status(200).json({ members: membersWithName });
  } catch (err) {
    res.status(500).json({ message: "Error fetching team", error: err.message });
  }
};


export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);

        // Find user by ID
        const user = await User.findById(id);

        // If user not found
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Respond with user data
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred", error });
    }
};

export const getUserDetailsById = async (req, res) => {
    const { _id } = req.params;

    try {
        const user = await User.findById(_id);

        return res.status(200).json({ message: "user Details", user });
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error });
    }
};

export const getAllUser = async (req, res) => {
    const { adminEmail } = req.body;
    const page = parseInt(req.query.page) || 1;  
    const limit = parseInt(req.query.limit) || 5; 

    console.log(process.env.Admin_Email)
    console.log("object",adminEmail)

    if (adminEmail !== process.env.Admin_Email) {
        return res.status(401).json({ message: "Unauthorized access." });
    }

    try {
        const skip = (page - 1) * limit;

        const users = await User.find()
            .skip(skip)
            .limit(limit)
            .select("username email teamName -_id")
            .sort({createdAt: -1})

        const totalUsers = await User.countDocuments();

        return res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers,
            users,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error.", error });
    }
};
