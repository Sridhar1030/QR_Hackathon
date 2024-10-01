import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Use the useNavigate hook

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        localStorage.clear();
        try {
            const response = await axios.post(
                `${backendUrl}/api/users/login`,
                {
                    email,
                    password,
                }
            );

            if (response.data.role === "admin") {
                localStorage.setItem("email", JSON.stringify(response.data.email));
                localStorage.setItem("role","admin")
                navigate("/admin"); // Use navigate function to route
            } else {
                localStorage.setItem("accessToken", JSON.stringify(response.data.accessToken));
                localStorage.setItem("id" , response.data.user._id )
                localStorage.setItem("role","user")
                navigate("/home"); // Use navigate function to route
            }
        } catch (err) {
            console.error("Error:", err);
            setError("Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-gray-700 mb-2"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Your Email"
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-6 relative">
                        <label
                            htmlFor="password"
                            className="block text-gray-700 mb-2"
                        >
                            Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            placeholder="Enter Your Password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-sm text-blue-500"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
