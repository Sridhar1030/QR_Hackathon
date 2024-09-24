import { User } from "../models/user.model.js"; 
import QRCode from "qrcode";


// Controller for signing up a user
export const signUpUser = async (req, res) => {
	const { username, email, password } = req.body;

	// Access participant emails from the request
	const participantEmails = req.participantEmails;

	// Check if the email is in the participant email list
	if (!participantEmails.includes(email)) {
		return res
			.status(400)
			.json({
				message:
					"Email not verified. Please use a valid participant email.",
			});
	}

    const qrCodeData = {
        username,
        email,
    }
    const qrCode = await QRCode.toDataURL(JSON.stringify(qrCodeData));
    console.log(qrCode)
	try {
		const newUser = new User({ username, email, password,qrCode });
		await newUser.save();
		res.status(201).json({ message: "User registered successfully!" });
	} catch (error) {
		res.status(500).json({ message: "Error registering user.", error });
	}
};
