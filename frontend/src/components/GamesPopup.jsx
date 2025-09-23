import React, { useRef, useState } from "react";
import { Gamepad2, Target, Truck, Dice6, X, Play, Trophy } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
const GamesPopup = ({ isOpen, onClose }) => {
    const popupRef = useRef(null);
    const [hoveredGame, setHoveredGame] = useState(null);
    const navigate = useNavigate();
    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            onClose();
        }
    };

    const handleGameClick = (gameRoute) => {
        navigate(gameRoute);
        console.log(`Navigating to ${gameRoute}`);
        onClose();
    };

    if (!isOpen) return null;

    const games = [
        {
            route: '/game1',
            icon: <Target className="w-6 h-6" />,
            title: "Ball Game",
            subtitle: "Precision Racing",
            description: "Test your accuracy and timing"
        },
        {
            route: '/game2',
            icon: <Truck className="w-6 h-6" />,
            title: "Truck Driving",
            subtitle: "Heavy Machinery",
            description: "Master the big rigs"
        },
        {
            route: '/game3',
            icon: <Dice6 className="w-6 h-6" />,
            title: "Domino Game",
            subtitle: "Strategy Challenge",
            description: "Think ahead to win"
        }
    ];

    return (
        <div
            className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-gray-800 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={handleClickOutside}
        >
            {/* Simple background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                        backgroundSize: "20px 20px",
                    }}
                    className="w-full h-full"
                ></div>
            </div>

            <div
                ref={popupRef}
                className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 max-w-lg w-full shadow-2xl relative border-2 border-yellow-400 mx-4"
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-mono font-bold text-yellow-400 mb-2 tracking-wide flex items-center space-x-3">
                            <Gamepad2 className="w-8 h-8" />
                            <span>RACING ARCADE</span>
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-yellow-400 transition-all duration-200 rounded-xl hover:bg-yellow-400/10 hover:scale-110"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    {games.map((game, index) => (
                        <GameButton
                            key={index}
                            onClick={() => handleGameClick(game.route)}
                            icon={game.icon}
                            title={game.title}
                            subtitle={game.subtitle}
                            description={game.description}
                            isHovered={hoveredGame === index}
                            onHover={() => setHoveredGame(index)}
                            onLeave={() => setHoveredGame(null)}
                        />
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <div className="flex items-center justify-center space-x-2 text-gray-400 font-mono text-sm">
                        <Trophy className="w-4 h-4" />
                        <span>Choose Your Challenge</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const GameButton = ({ onClick, icon, title, subtitle, description, isHovered, onHover, onLeave }) => (
    <button
        onClick={onClick}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        className="w-full bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 border-2 border-yellow-400/30 
                 hover:border-yellow-400/60 text-white p-6 rounded-2xl transition-all duration-300 
                 shadow-lg hover:shadow-yellow-400/10 transform hover:scale-105 active:scale-95 
                 group relative overflow-hidden"
    >
        {/* Subtle glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-yellow-400/10 to-yellow-400/5 
                        transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>

        <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className={`p-3 bg-yellow-400/20 rounded-full transition-all duration-300 
                              ${isHovered ? 'bg-yellow-400/30 scale-110' : ''}`}>
                    <div className="text-yellow-400">
                        {icon}
                    </div>
                </div>
                <div className="text-left">
                    <div className="text-lg font-mono font-bold text-yellow-400">{title}</div>
                    <div className="text-sm text-gray-300 font-mono font-medium">{subtitle}</div>
                    <div className={`text-xs text-gray-400 font-mono transition-all duration-300 
                                   ${isHovered ? 'opacity-100 mt-1' : 'opacity-0 mt-0'}`}>
                        {description}
                    </div>
                </div>
            </div>

            <div className={`flex items-center space-x-2 transition-all duration-300 
                           ${isHovered ? 'transform translate-x-0' : 'transform translate-x-2'}`}>
                <Play className="w-5 h-5 text-yellow-400" />
            </div>
        </div>

    </button>
);

export default GamesPopup;