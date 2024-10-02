import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import participantsGroupedData from './FinalTeam.json';

const SignupPage = () => {
    const [teamName, setTeamName] = useState("");
    const [teams, setTeams] = useState({});
    const [selectedTeam, setSelectedTeam] = useState(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const adminEmail = localStorage.getItem("email");
    const cleanedEmail = adminEmail.replace(/"/g, "");

    useEffect(() => {
        // Load the JSON data from the local file when the component mounts
        setTeams(participantsGroupedData);
    }, []);

    const handleTeamSelect = (e) => {
        const selectedTeamName = e.target.value;
        setTeamName(selectedTeamName);
        setSelectedTeam(teams[selectedTeamName]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${backendUrl}/api/users/signup`,
                {
                    teamName: teamName.trim(),
                    adminEmail: cleanedEmail
                }
            );

            toast.success(response.data.message || "Team signed up successfully!");

            // Remove the signed-up team from the local data
            const updatedTeams = { ...teams };
            delete updatedTeams[teamName];
            setTeams(updatedTeams);

            // Reset the form and selected team
            setTeamName("");
            setSelectedTeam(null);

            // Here, you would typically update the JSON file on the server
            // Since we're working with a local file, you'll need to implement
            // a way to persist these changes, possibly by sending the updated
            // data to the server to rewrite the file

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        }
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 md:bg-cover md:bg-center md:bg-no-repeat flex items-center justify-center p-4"
            style={{
                backgroundImage: 'url("/api/placeholder/1920/1080")',
            }}
        >
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <div className="bg-white md:bg-opacity-90 rounded-lg shadow-xl p-6 md:p-8 w-full max-w-md">
                <div className="text-center mb-6 md:mb-8">
                    <svg
                        className="mx-auto h-10 w-10 md:h-12 md:w-12 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                    </svg>
                    <h2 className="mt-3 md:mt-4 text-2xl md:text-3xl font-bold text-gray-900">
                        Team Signup
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Join the adventure with your team!
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    <div>
                        <label
                            htmlFor="teamName"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Team Name
                        </label>
                        <select
                            id="teamName"
                            value={teamName}
                            onChange={handleTeamSelect}
                            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select a team</option>
                            {Object.keys(teams).map((team) => (
                                <option key={team} value={team}>
                                    {team}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedTeam && (
                        <div className="mt-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Team Members:</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                {selectedTeam.map((member, index) => (
                                    <li key={index} className="text-sm text-gray-600">
                                        {member.name} - {member.email}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;