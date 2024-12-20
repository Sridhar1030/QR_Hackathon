import { User } from "../models/user.model.js";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { json } from "express";
import { sendEmail } from "../utils/sendmail.js";

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

// Controller for signing up a user
export const signUpUser = async (req, res) => {
    const { teamName, adminEmail } = req.body;

    if (!(adminEmail === process.env.Admin_Email)) {
        return res.status(401).json({ message: "Unauthorized access." });
    }

    const teamNameExists = await User.findOne({ teamName });

    if (teamNameExists) {
        return res.status(400).json({ message: "Team already exists." });
    }

    const teamsFilePath = path.join(
        process.cwd(),
        "./participantsGrouped.json"
    );

    try {
        // Load the participant emails asynchronously
        const data = await fs.promises.readFile(teamsFilePath, "utf8");
        const participants = JSON.parse(data);

        // Ensure the team exists in the file
        const members = participants[teamName];
        if (!members) {
            return res.status(404).json({ message: "Team not found." });
        }

        for (const member of members) {
            const phoneLength = member.phoneNumber.length;

            const firstTwo = member.phoneNumber.substring(0, 2);

            const middleIndex = Math.floor(phoneLength / 2);
            const middleTwo = member.phoneNumber.substring(middleIndex - 1, middleIndex + 1);

            const lastTwo = member.phoneNumber.substring(phoneLength - 2);

            const password = firstTwo + middleTwo + lastTwo;

            const newUser = new User({
                username: member.name,
                email: member.email,
                teamName: teamName,
                phoneNumber: member.phoneNumber,
                github: member.github,
                college: member.college,
                gender: member.gender,
                password: password,
            });

            sendEmail(member.email, password, member.name)
                .then((data) => {
                    console.log(data);
                })
                .catch((error) => {
                    console.log(error);
                });

            await newUser.save();
        }

        return res.status(201).json({ message: "Users created successfully." });
    } catch (err) {
        console.error("Error reading or processing file:", err);
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
    const { teamName } = req.body;

    try {
        const member = await User.find({ teamName });

        if (!member) {
            return res.status(404).json({ message: "Team not found." });
        }

        return res
            .status(200)
            .json({ message: "team member detail fetch", member });
    } catch (error) {
        res.status(500).json({
            message: "Server error while logging in user.",
        });
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
