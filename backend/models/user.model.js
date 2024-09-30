import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			index: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			index: true,
		},
		phoneNumber :{
			type: String,
			required: true,
			unique: true,
		},
		github:{
			type: String,
			required: true,
			unique: true,
		},
		college: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		refreshToken: {
			// Added refreshToken field
			type: String,
		},
		gender : {
			type: String,
			required: true,
		},
		teamName: {
			type : String,
			required: true,
		},
		meals: {
			breakfast1: { type: Boolean, default: false },
			breakfast2: { type: Boolean, default: false },
			lunch: { type: Boolean, default: false },
			dinner: { type: Boolean, default: false },
		},
		role: {
			type: String,
			enum:['admin', 'user'],
			default: "user"
		}
	},
	{
		timestamps: true,
	}
);

// Hash password before saving
userSchema.pre("save", function (next) {
	if (!this.isModified("password")) return next();
	this.password = bcrypt.hashSync(this.password, 10);
	next();
});

// Method to check password (async)
userSchema.methods.checkPassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

// Generate access token
userSchema.methods.generateAccessToken = function () {
	return jwt.sign(
		{
			id: this._id,
			username: this.username,
			email: this.email,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
		}
	);
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function () {
	return jwt.sign(
		{
			id: this._id,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
		}
	);
};

export const User = mongoose.model("User", userSchema);
