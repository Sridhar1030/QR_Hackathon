import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Replace with your actual backend URL and navigation logic
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        setError("");

        // Replace this simulation with your actual login logic
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Your actual login logic would go here:

            const response = await axios.post(
                `${backendUrl}/api/users/login`,
                { email, password }
            );

            if (response.data.role === "admin") {
                // Store admin data and navigate
                localStorage.setItem("email", JSON.stringify(response.data.email));
                localStorage.setItem("role", "admin")
                navigate("/adminDash");
            } else {
                // Store user data and navigate
                localStorage.setItem("accessToken", JSON.stringify(response.data.accessToken));
                localStorage.setItem("id", response.data.user._id)
                localStorage.setItem("role", "user")
                navigate("/home");
            }

            console.log("Login successful", { email, password });
            setIsLoading(false);
        } catch (err) {
            console.error("Error:", err);
            setError("Login failed. Please check your credentials.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-1"></div>
                <div className="absolute top-16 left-0 w-full h-32 bg-gradient-to-r from-transparent via-gray-400 to-transparent transform skew-y-1"></div>
            </div>

            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                    backgroundSize: "20px 20px",
                }}
            ></div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="relative mb-8">
                        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-yellow-400 leading-tight font-mono tracking-wider transform hover:scale-105 transition-transform duration-300">
                           LOGIN ACCESS
                            <br />

                        </h1>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl max-w-md mx-auto border-2 border-red-600 shadow-2xl shadow-red-600/20 relative overflow-hidden">
                        <div className="absolute top-4 right-4 flex space-x-2">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-75"></div>
                            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse delay-150"></div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-900/50 border-l-4 border-red-500 rounded-xl">
                                <p className="text-red-200 font-mono font-medium">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email input */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-bold text-yellow-400 mb-2 text-left font-mono tracking-wider"
                                >
                                    🏎️ EMAIL ADDRESS
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-red-500" />
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter racing credentials"
                                        required
                                        className="w-full pl-14 pr-4 py-4 bg-gray-800 border-2 border-gray-600 rounded-full text-white font-mono placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/20 transition-all duration-300 hover:border-red-500"
                                    />
                                </div>
                            </div>

                            {/* Password input */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-bold text-yellow-400 mb-2 text-left font-mono tracking-wider"
                                >
                                    🔐 SECURITY PASSCODE
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-red-500" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={password}
                                        placeholder="Enter access code"
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-14 pr-14 py-4 bg-gray-800 border-2 border-gray-600 rounded-full text-white font-mono placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/20 transition-all duration-300 hover:border-red-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors duration-200 focus:outline-none z-10"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Login button */}
                            <button
                                type="submit"
                                disabled={isLoading || !email || !password}
                                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-4 rounded-full font-black font-mono tracking-wider hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-yellow-400/50 border-2 border-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center space-x-3">
                                        <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                        <span>🚀 ACCESSING...</span>
                                    </div>
                                ) : (
                                    <span>🚀 IGNITION START</span>
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <p className="text-gray-400 text-sm font-mono">
                                🏁 Secure Racing Portal
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;