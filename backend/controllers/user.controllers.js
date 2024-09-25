import { User } from "../models/user.model.js";
import QRCode from "qrcode";

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
	const { username, email, password } = req.body;

	// Access participant emails from the request
	const participantEmails = req.participantEmails;

	// Check if the email is in the participant email list
	if (!participantEmails.includes(email)) {
		return res.status(400).json({
			message:
				"Email not verified. Please use a valid participant email.",
		});
	}

	const qrCodeData = { username, email };
	const qrCode = await QRCode.toDataURL(JSON.stringify(qrCodeData));

	try {
		const newUser = new User({ username, email, password, qrCode });
		await newUser.save();
		res.status(201).json({ message: "User registered successfully!" });
	} catch (error) {
		console.error("Error registering user:", error);
		res.status(500).json({ message: "Error registering user.", error });
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
			user: { id: user._id, username: user.username },
			accessToken,
			refreshToken,
			role: "user",
		});
	} catch (error) {
		console.error("Error logging in user:", error); // Log detailed error
		res.status(500).json({
			message: "Server error while logging in user.",
		});
	}
};
