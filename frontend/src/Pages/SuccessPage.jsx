import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const SuccessPage = () => {
    const { state } = useLocation();
    const [username, setUsername] = useState(null);
    const [loading, setLoading] = useState(true);
    const userId = state?.userId;
    const meal = state?.meal;

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (userId) {
                try {
                    const response = await axios.get(`http://localhost:3000/api/users/userDetails/${userId}`);
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

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-green-200 ">
            <h1 className="text-4xl font-bold">Scan Successful!</h1>
            {loading ? (
                <p className="text-lg">Loading...</p>
            ) : (
                <>
                    {username ? (
                        <p className="text-xl">Successfully scanned for user: {username} for {meal}</p>
                    ) : (
                        <p className="text-xl">User ID not found.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default SuccessPage;
