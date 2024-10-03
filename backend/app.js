import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cron from "node-cron";
import shell from "shelljs";

const app = express();

app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	})
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const buildPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(buildPath));

// const emailListPath = path.join(process.cwd(), "participantsGrouped.json"); // Adjust the path as needed
// let participantEmails = [];

// // Load the participant emails
// fs.readFile(emailListPath, "utf8", (err, data) => {
// 	if (err) {
// 		console.error("Error reading email file:", err);
// 		return;
// 	}
// 	participantEmails = JSON.parse(data).emails;
// });

// app.use((req, res, next) => {
// 	req.participantEmails = participantEmails;
// 	next();
// });

cron.schedule("*/15 * * * *", () => {
	console.log("Running a task every 15 minutes");
});

app.get("/", (req, res) => {
	res.send("API is running...");
});

import { userRoutes } from "./routes/user.routes.js";

app.use("/api/users", userRoutes);


app.get("/*", function (req, res) {
    res.sendFile(
        path.join(__dirname, "../frontend/dist/index.html"),
        function (err) {
            if (err) {
                res.status(500).send(err);
            }
        }
    );
});

export { app };
