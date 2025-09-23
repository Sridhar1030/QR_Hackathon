import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, Zap, ChevronRight } from "lucide-react";

const SuccessPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [showConfetti, setShowConfetti] = useState(false);

    const userId = state?.userId;
    const meal = state?.meal;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (userId) {
                try {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1500));
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

    const handleAdminRedirect = (e) => {
        // Replace with your actual navigation:
        navigate("/admin");
        console.log("Redirecting to admin...");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 relative overflow-hidden">
            {/* Dynamic cursor follower */}
            <div
                className="fixed w-6 h-6 bg-red-600/20 rounded-full pointer-events-none z-50 transition-all duration-300 ease-out"
                style={{
                    left: mousePosition.x - 12,
                    top: mousePosition.y - 12,
                }}
            />

            {/* Animated Ferrari-inspired background effects */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-72 h-72 bg-red-600 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-700 rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2 animate-pulse delay-75"></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-red-500 rounded-full filter blur-2xl transform -translate-x-1/2 -translate-y-1/2 animate-ping opacity-10"></div>
            </div>
            {/* Racing stripes decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-red-600 to-transparent opacity-30 transform -skew-x-12"></div>
                <div className="absolute top-0 right-1/4 w-1 h-full bg-gradient-to-b from-red-600 to-transparent opacity-30 transform skew-x-12"></div>
            </div>

            {/* Success confetti effect */}
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none z-30">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-red-400 rounded-full animate-ping opacity-60"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                            }}
                        />
                    ))}
                </div>
            )}
            {/* Main success card */}
            <div className="bg-black/85 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center border border-red-600/30 relative z-10 max-w-lg mx-4 transform hover:scale-105 transition-all duration-300">
                {/* Animated red accent border */}
                <div className="absolute inset-0 rounded-3xl border-2 border-red-600/50 pointer-events-none">
                    <div className="absolute inset-0 rounded-3xl border border-red-400/30 animate-pulse"></div>
                </div>

                {/* Success icon with animations */}
                <div className="text-red-500 mb-6 relative">
                    <div className="relative inline-block">
                        <CheckCircle className="h-20 w-20 mx-auto " />
                        <div className="absolute inset-0 h-20 w-20 mx-auto animate-ping opacity-30">
                            <CheckCircle className="h-20 w-20" />
                        </div>
                    </div>
                    {/* Success pulse rings */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 border-2 border-red-500/30 rounded-full animate-ping"></div>
                        <div className="absolute w-32 h-32 border border-red-400/20 rounded-full animate-ping delay-75"></div>
                    </div>
                </div>

                {/* Success title with gradient text */}
                <div className="mb-6">
                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600 mb-2 tracking-wider animate-pulse">
                        SCAN SUCCESS!
                    </h1>
                    <div className="w-32 h-1 bg-gradient-to-r from-red-600 to-red-400 mx-auto rounded-full animate-pulse">
                        <div className="h-full w-0 bg-white/50 rounded-full animate-ping"></div>
                    </div>
                </div>

                {/* Content section */}
                <div className="mb-8">
                    {loading ? (
                        <div className="flex items-center justify-center space-x-3">
                            <div className="w-6 h-6 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"></div>
                            <p className="text-lg text-red-200 animate-pulse">PROCESSING...</p>
                            <div className="flex space-x-1">
                                <div className="w-1 h-1 bg-red-400 rounded-full animate-ping"></div>
                                <div className="w-1 h-1 bg-red-400 rounded-full animate-ping delay-75"></div>
                                <div className="w-1 h-1 bg-red-400 rounded-full animate-ping delay-150"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {username ? (
                                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-red-600/20">
                                    <p className="text-xl text-white leading-relaxed">
                                        Successfully scanned for{" "}
                                        <span className="font-black text-red-400 text-2xl tracking-wide animate-pulse">
                                            {username}
                                        </span>
                                        {" "}for{" "}
                                        <span className="font-black text-red-400 text-2xl tracking-wide animate-pulse">
                                            {meal}
                                        </span>
                                        .
                                    </p>
                                    <div className="flex items-center justify-center mt-4 space-x-2">
                                        <Zap className="w-5 h-5 text-red-400 animate-pulse" />
                                        <span className="text-red-300 font-medium">Access Granted</span>
                                        <Zap className="w-5 h-5 text-red-400 animate-pulse" />
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-red-900/50 backdrop-blur-sm rounded-xl p-6 border border-red-500/30">
                                    <p className="text-xl text-red-200">User ID not found.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Interactive admin button */}
                <button
                    onClick={handleAdminRedirect}
                    disabled={loading}
                    className="group relative overflow-hidden bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white 
                             px-8 py-4 text-lg font-black tracking-wider rounded-xl
                             hover:from-red-700 hover:via-red-800 hover:to-red-900 
                             transform hover:scale-105 active:scale-95
                             transition-all duration-300 shadow-lg hover:shadow-2xl 
                             hover:shadow-red-600/50 border border-red-500/50
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-700"></div>

                    {/* Button content */}
                    <div className="relative z-10 flex items-center space-x-2">
                        <span className="group-hover:animate-pulse">GO TO ADMIN</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 rounded-xl bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                </button>

                {/* Racing themed footer */}
                {/* <div className="mt-6">
                    <p className="text-gray-400 text-sm hover:text-red-400 transition-colors duration-300">
                        🏁 Access Verified • Racing Portal 🏁
                    </p>
                </div> */}
            </div>

            {/* Enhanced racing-inspired bottom decoration */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                <div className="h-0.5 w-8 bg-gradient-to-r from-transparent to-red-600 animate-pulse"></div>
                <div className="w-3 h-3 bg-red-600 rounded-full animate-ping shadow-lg shadow-red-600/50"></div>
                <div className="h-0.5 w-20 bg-gradient-to-r from-red-600 via-red-700 to-red-800 animate-pulse delay-75"></div>
                <div className="w-3 h-3 bg-red-800 rounded-full animate-ping delay-150 shadow-lg shadow-red-800/50"></div>
                <div className="h-0.5 w-8 bg-gradient-to-r from-red-800 to-transparent animate-pulse delay-75"></div>
            </div>
        </div>
    );
};

export default SuccessPage;