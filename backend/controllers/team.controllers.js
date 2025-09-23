import { Team } from "../models/team.models.js";

export const getSelectedTeams = async (req, res) => {
  try {
    const teams = await Team.find({ isSelected: true })
      .populate("members", "fname email") // only fname + email
      .populate("leader", "fname email")  // only fname + email
      .select("name members leader");     // include team name + populated members

    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ message: "Error fetching teams", error: err.message });
  }
};
