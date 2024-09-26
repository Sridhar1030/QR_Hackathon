import React, { useState } from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
    const [showEasterEgg, setShowEasterEgg] = useState(false);

    const handleEasterEggClick = () => {
        setShowEasterEgg(!showEasterEgg);
    };

    return (
        <section className="flex items-center justify-center min-h-screen bg-white">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-black">404</h1>
                <div
                    className="flex items-center justify-center bg-cover bg-center h-96 cursor-pointer"
                    style={{
                        backgroundImage: 'url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)',
                    }}
                    onClick={handleEasterEggClick} 
                >
                </div>

                <div className="mt-[-50px]">
                    <h3 className="text-3xl font-semibold mt-5">Looks like you're lost</h3>
                    <p className="mt-3 text-lg">The page you are looking for is not available!</p>

                    <Link to="/home" className="mt-5 inline-block px-6 py-2 text-white bg-green-600 rounded hover:bg-green-500 transition duration-300">
                        Go to Home
                    </Link>
                </div>

                {showEasterEgg && ( // Conditional rendering for the Easter egg
                    <div className="mt-5">
                        <h2 className="text-2xl font-bold text-green-600">🎉 You found the Easter Egg! 🎉</h2>
                        <p className="mt-2 text-lg">Congratulations! Keep exploring!</p>
                        <p className="mt-2 text-lg font-semibold text-green-500">I think your team will win the hackathon! 🏆</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default NotFoundPage;
