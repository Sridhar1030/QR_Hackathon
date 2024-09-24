import dotenv from "dotenv";
import { connectDB } from "./db/index.js";

import { app } from "./app.js";

dotenv.config({
	path: "./.env",
});

connectDB()
	.then(() => {
		app.listen(process.env.PORT, () => {
			console.log(
				` ⚙️ Server is running on port http://localhost:${process.env.PORT}`
			);
		});
	})
	.catch((error) => {
		console.error(` ❌ fail to connect: ${error.message}`);
		process.exit(1);
	});