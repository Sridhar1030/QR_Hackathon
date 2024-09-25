import { User } from "../models/user.model.js";
import QRCode from "qrcode";

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

	const qrCodeData = {
		username,
		email,
		
	};
	const qrCode = await QRCode.toDataURL(JSON.stringify(qrCodeData));
	// console.log(qrCode);
	try {
		const newUser = new User({ username, email, password, qrCode });
		await newUser.save();
		res.status(201).json({ message: "User registered successfully!" });
	} catch (error) {
		res.status(500).json({ message: "Error registering user.", error });
	}
};

//login
export const loginUser = async (req, res) => {
	const {  email, password } = req.body;
	console.log(req.body)
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res
				.status(401)
				.json({ message: "Invalid email or password" });
		}
		const isMatch = user.checkPassword(password);
		if (!isMatch) {
			return res
				.status(401)
				.json({ message: "Invalid email or password" });
		}
		return res.status(200).json({ message: "User logged in successfully!", user: { id: user._id, username: user.username , qrCode:user.qrCode} });
	} catch (error) {
		res.status(500).json({ message: "Error logging in user.", error });
	}
};
