import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import QRCode from "qrcode";

const QRCodePage = () => {
    const [currentMeal, setCurrentMeal] = useState("");
    const [userId, setUserId] = useState(null);
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const link = "https://youtu.be/dQw4w9WgXcQ?si=Z89EeRG8ovOojrhk";

    useEffect(() => {
        const storedUserId = localStorage.getItem("id");
        if (storedUserId) {
            setUserId(storedUserId);
        }
        updateCurrentMeal();
    }, []);

    useEffect(() => {
        const generateQRCode = async () => {
            if (userId && currentMeal) {
                const qrData = {
                    userId: userId,
                    meal: currentMeal,
                    youtube: link,
                };

                try {
                    const url = await QRCode.toDataURL(JSON.stringify(qrData));
                    setQrCodeUrl(url);
                } catch (error) {
                    console.error("Error generating QR code", error);
                }
            }
        };

        generateQRCode();
    }, [userId, currentMeal]);

    const updateCurrentMeal = () => {
        const now = new Date();
        const currentDate = now.toDateString(); // Get the current date as a string
        const hour = now.getHours();
        const minute = now.getMinutes();

        // Define your two specific days
        const day1 = "Thu Oct 03 2024"; // Change this to your specific day
        const day2 = "FRI Oct 04 2024"; // Change this to your specific day

        // Check if the current date is day1 or day2
        console.log(currentDate)
        if (currentDate === day1) {
            console.log("inside day 1")
            if (hour === 9 && minute >= 0 && minute < 60) {
                setCurrentMeal("breakfast1");
                console.log("inside breakfast")
            } else if (hour >= 12 && hour < 16) {
                setCurrentMeal("lunch1");
            } else if (hour >= 17 && hour < 19) {
                setCurrentMeal("snacks");
            } else if (hour >= 20 && hour <= 23) {
                setCurrentMeal("dinner");
            } else {
                setCurrentMeal(null); // Reset if it's not meal time
            }
        } else if (currentDate === day2) {
            if (hour === 10 && minute >= 0 && minute < 60) {
                setCurrentMeal("breakfast2");
            } else if (hour >= 12 && hour < 18) {
                setCurrentMeal("lunch2");
            } else {
                setCurrentMeal(null); // Reset if it's not meal time
            }
        } else {
            setCurrentMeal(null); // Reset meal if it's neither day1 nor day2
        }
    };

    const getMealDisplayName = (meal) => {
        const mealNames = {
            breakfast1: "🍳 BREAKFAST - DAY 1",
            lunch1: "🍕 LUNCH - DAY 1", 
            snacks: "🍿 SNACKS TIME",
            dinner: "🍽️ DINNER",
            breakfast2: "🥞 BREAKFAST - DAY 2",
            lunch2: "🍔 LUNCH - DAY 2"
        };
        return mealNames[meal] || "🏁 MEAL TIME";
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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="text-center mb-16">
                    <div className="relative mb-8">
                        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-yellow-400 leading-tight font-mono tracking-wider transform hover:scale-105 transition-transform duration-300">
                            QR CODE
                            <br />
                            <span className="text-4xl md:text-4xl bg-gradient-to-r from-yellow-400 to-white bg-clip-text text-transparent">
                                FUEL STATION
                            </span>
                        </h1>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl max-w-2xl mx-auto border-2 border-red-600 shadow-2xl shadow-red-600/20 relative overflow-hidden">
                        <div className="absolute top-4 right-4 flex space-x-2">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-75"></div>
                            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse delay-150"></div>
                        </div>

                        {currentMeal ? (
                            <>
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-yellow-400 mb-4 font-mono tracking-wider">
                                        {getMealDisplayName(currentMeal)}
                                    </h2>
                                    <div className="text-sm text-gray-300 font-mono">
                                        🏎️ Ready to fuel up? Scan below!
                                    </div>
                                </div>

                                {qrCodeUrl ? (
                                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-600 mb-6">
                                        <img
                                            src={qrCodeUrl}
                                            alt="QR Code"
                                            className="mx-auto bg-white p-4 rounded-lg shadow-lg max-w-64"
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-600 mb-6">
                                        <div className="w-64 h-64 mx-auto bg-gray-700 rounded-lg flex items-center justify-center">
                                            <div className="text-gray-400 font-mono">
                                                <div className="animate-spin w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-2"></div>
                                                Generating QR...
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-red-400 mb-4 font-mono tracking-wider">
                                    ⚠️ PIT STOP CLOSED
                                </h2>
                                <div className="bg-gray-800 rounded-xl p-6 border border-red-600">
                                    <p className="text-gray-300 font-mono text-lg mb-4">
                                        🚫 No active meal session right now
                                    </p>
                                    <p className="text-sm text-gray-400 font-mono">
                                        Come back during meal hours to get your QR code!
                                    </p>
                                </div>
                            </div>
                        )}

                        <Link 
                            to="/home" 
                            className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-4 rounded-full font-black font-mono tracking-wider hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-yellow-400/50 border-2 border-yellow-600"
                        >
                            🏠 BACK TO GARAGE
                        </Link>
                    </div>

                    {userId && (
                        <div className="mt-8 bg-gradient-to-br from-gray-900 to-black p-4 rounded-xl max-w-md mx-auto border border-gray-600">
                            <div className="text-sm text-gray-400 font-mono">
                                <span className="text-yellow-400">🏁 DRIVER ID:</span> {userId}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default QRCodePage;