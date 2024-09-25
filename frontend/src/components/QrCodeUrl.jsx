import React from "react";
import { useLocation, Link } from "react-router-dom";

const QRCodePage = () => {
    // Use the useLocation hook to access the state (qrCodeUrl)
    const location = useLocation();
    const { qrCodeUrl , mealType } = location.state || {}; // Destructure qrCodeUrl from state

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-800">
            <h1 className="text-white text-3xl mb-8">Your QR Code {mealType}</h1>

            {qrCodeUrl ? (
                <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="border-2 border-white p-4"
                />
            ) : (
                <p className="text-white">No QR Code found</p>
            )}

            <Link to="/home" className="mt-8 text-xl text-blue-500 underline">
                Go Back to Homepage
            </Link>
        </div>
    );
};

export default QRCodePage;
