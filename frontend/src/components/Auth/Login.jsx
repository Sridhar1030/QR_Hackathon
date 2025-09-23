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
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 relative overflow-hidden flex items-center justify-center">
            {/* Ferrari-inspired background effects */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-72 h-72 bg-red-600 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-700 rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
                <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-red-500 rounded-full filter blur-2xl opacity-30"></div>
            </div>

            {/* Racing stripes decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-red-600 to-transparent opacity-30 transform -skew-x-12"></div>
                <div className="absolute top-0 right-1/4 w-1 h-full bg-gradient-to-b from-red-600 to-transparent opacity-30 transform skew-x-12"></div>
            </div>

            {/* Login container */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-black/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-red-600/30 p-8 relative overflow-hidden">
                    {/* Red accent border */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-red-600/50 pointer-events-none"></div>

                    {/* Ferrari-inspired header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-red-600/50 border-2 border-red-500">
                            <div className="w-16 h-16 bg-black/30 rounded-full flex items-center justify-center">
                                <Lock className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-4xl font-black text-white mb-2 tracking-wider">LOGIN</h2>
                        <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-red-400 mx-auto mb-3"></div>
                        <p className="text-gray-300 text-lg font-medium">Access Your Dashboard</p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-900/50 border-l-4 border-red-500 rounded-xl backdrop-blur-sm">
                            <p className="text-red-200 font-medium">{error}</p>
                        </div>
                    )}

                    {/* Form inputs */}
                    <div className="space-y-6">
                        {/* Email input */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-white font-bold text-lg tracking-wide">
                                EMAIL
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-red-400 w-5 h-5 transition-colors" />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-gray-900/70 backdrop-blur-sm border border-gray-700 rounded-xl 
                                             text-white placeholder-gray-500 focus:outline-none focus:border-red-500 
                                             focus:ring-2 focus:ring-red-500/30 transition-all duration-300
                                             text-lg font-medium hover:border-red-600/50"
                                />
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-600/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Password input */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-white font-bold text-lg tracking-wide">
                                PASSWORD
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-red-400 w-5 h-5 transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    placeholder="Enter your password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-14 py-4 bg-gray-900/70 backdrop-blur-sm border border-gray-700 rounded-xl 
                                             text-white placeholder-gray-500 focus:outline-none focus:border-red-500 
                                             focus:ring-2 focus:ring-red-500/30 transition-all duration-300
                                             text-lg font-medium hover:border-red-600/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-400 
                                             transition-colors duration-200 focus:outline-none z-10"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-600/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Login button */}
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || !email || !password}
                            className="w-full bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-4 rounded-xl 
                                     text-xl font-black tracking-wider transition-all duration-300 shadow-lg
                                     transform hover:scale-105 active:scale-95 
                                     hover:shadow-2xl hover:shadow-red-600/50
                                     disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                                     border border-red-500/50 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-700"></div>
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-3">
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>LOGGING IN...</span>
                                </div>
                            ) : (
                                <span className="relative z-10">LOGIN</span>
                            )}
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-400 text-sm">
                            Secure Access Portal
                        </p>
                    </div>
                </div>

                {/* Racing-inspired bottom decoration */}
                <div className="mt-6 flex items-center justify-center space-x-4">
                    <div className="h-0.5 w-8 bg-gradient-to-r from-transparent to-red-600"></div>
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-lg shadow-red-600/50"></div>
                    <div className="h-0.5 w-16 bg-gradient-to-r from-red-600 to-red-800"></div>
                    <div className="w-3 h-3 bg-red-800 rounded-full animate-pulse delay-75 shadow-lg shadow-red-800/50"></div>
                    <div className="h-0.5 w-8 bg-gradient-to-r from-red-800 to-transparent"></div>
                </div>
            </div>
        </div>
    );
};

export default Login;