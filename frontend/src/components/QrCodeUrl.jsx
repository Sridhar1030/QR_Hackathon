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
        const day1 = "Fri Oct 04 2024"; // Change this to your specific day
        const day2 = "Sat Oct 05 2024"; // Change this to your specific day

        // Check if the current date is day1 or day2
        console.log(currentDate)
        console.log(day1)
        if (currentDate === day1) {
            console.log("inside day 1")
            if (hour === 9 && minute >= 0 && minute < 60) {
                setCurrentMeal("breakfast1");
                console.log("inside breakfast")
            } else if (hour >= 12 && hour < 16) {
                setCurrentMeal("lunch1");
            } else if (hour >= 17 && hour < 19) {
                setCurrentMeal("snacks");
            } else if (hour >=20 && hour <=23 ) {
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

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-800">
            <h1 className="text-white text-3xl mb-8">Your QR Code for {currentMeal}</h1>

            {qrCodeUrl ? (
                <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="border-2 border-white p-4"
                />
            ) : (
                <p className="text-white">No QR data available</p>
            )}

            <Link to="/home" className="mt-8 text-xl text-blue-500 underline">
                Go Back to Homepage
            </Link>
        </div>
    );
};

export default QRCodePage;
