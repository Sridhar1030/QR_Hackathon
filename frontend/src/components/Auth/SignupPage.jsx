import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignupPage = () => {
    const [teamName, setTeamName] = useState("");

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const adminEmail = localStorage.getItem("email");
    const cleanedEmail = adminEmail.replace(/"/g, "");

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

            toast.success(
                response.data.message || "Team signed up successfully!"
            );

            setTeamName("");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Something went wrong. Please try again."
            );
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSubmit(e);
        }
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 md:bg-cover md:bg-center md:bg-no-repeat flex items-center justify-center p-4"
            style={{
                backgroundImage: 'url("/api/placeholder/1920/1080")',
            }}
        >
            {/* ToastContainer with responsive position */}
            <ToastContainer
                position="top-center" // Central position, works well for mobile
                autoClose={3000} // Adjust close time
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

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 md:space-y-6"
                >
                    <div>
                        <label
                            htmlFor="teamName"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Team Name
                        </label>
                        <input
                            type="text"
                            id="teamName"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                            focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter your team name"
                            required
                        />
                    </div>
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
