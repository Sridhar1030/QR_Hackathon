import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const SuccessPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);
    const [loading, setLoading] = useState(true);
    const userId = state?.userId;
    const meal = state?.meal;

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (userId) {
                try {
                    const response = await axios.get(`${backendUrl}/api/users/userDetails/${userId}`);
                    setUsername(response.data.username); // Adjust based on your API response structure
                } catch (error) {
                    console.error("Error fetching user details:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [userId]);

    const handleAdminRedirect = () => {
        navigate("/admin");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-green-400 to-blue-400">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="text-green-500 mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-20 w-20 mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4" />
                    </svg>
                </div>

                <h1 className="text-5xl font-bold text-gray-800 mb-6">Scan Successful!</h1>
                {loading ? (
                    <p className="text-lg text-gray-600">Loading...</p>
                ) : (
                    <>
                        {username ? (
                            <p className="text-xl text-gray-700">
                                Successfully scanned for <span className="font-semibold">{username}</span> for <span className="font-semibold">{meal}</span>.
                            </p>
                        ) : (
                            <p className="text-xl text-red-500">User ID not found.</p>
                        )}
                    </>
                )}
                <button
                    onClick={handleAdminRedirect}
                    className="mt-8 px-6 py-3 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                    Go to Admin
                </button>
            </div>
        </div>
    );
};

export default SuccessPage;
