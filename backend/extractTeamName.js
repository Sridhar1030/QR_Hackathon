import fs from "fs";

// Read the JSON file
const jsonData = JSON.parse(fs.readFileSync("participantsGrouped.json", "utf8"));

// Extract all team names
const teamNames = Object.keys(jsonData);

// Store the team names in a new JSON file
const teamNameData = teamNames.map((name) => ({ teamName: name }));

// Write to a new JSON file
fs.writeFileSync(
	"teamName.json",
	JSON.stringify(teamNameData, null, 2),
	"utf8"
);

console.log(
	"Team names have been successfully extracted and stored in teamName.json"
);
