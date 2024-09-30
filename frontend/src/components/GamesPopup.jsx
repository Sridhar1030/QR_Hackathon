import React, { useRef } from "react";
import { FaBasketballBall, FaTruck, FaDice } from "react-icons/fa"; 
import { Link } from "react-router-dom";

const GamesPopup = ({ isOpen, onClose }) => {
    const popupRef = useRef(null); 

    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleClickOutside} 
        >
            <div
                ref={popupRef} 
                className="bg-white rounded-xl p-8 max-w-lg w-full shadow-lg relative"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-semibold text-gray-900">
                        Choose a Game
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <div className="grid gap-6">
                    <Link to='/game1' className="w-full flex items-center bg-blue-500 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-all shadow-md">
                        <FaBasketballBall className="mr-3 h-6 w-6" />
                        Ball Game
                    </Link>
                    <Link to='/game2' className="w-full flex items-center bg-blue-500 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-all shadow-md">
                        <FaTruck className="mr-3 h-6 w-6" />
                        Truck Driving
                    </Link>
                    <Link to='/game3' className="w-full flex items-center bg-blue-500 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-all shadow-md">
                        <FaDice className="mr-3 h-6 w-6" />
                        Domino Game
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default GamesPopup;
