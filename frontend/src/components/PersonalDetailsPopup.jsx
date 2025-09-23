import React, { useRef, useState } from "react";
import { X, User, Mail, Phone, School, Users, Github, Utensils, CheckCircle, XCircle, Trophy, Zap } from "lucide-react";

const PersonalDetailsPopup = ({ isOpen, onClose, userDetails }) => {
    const popupRef = useRef(null);
    const [activeTab, setActiveTab] = useState('profile');

    // Mock user details for demo - replace with your actual userDetails prop
    const defaultDetails = {
        username: "Speed Racer",
        email: "speed.racer@racing.com",
        phoneNumber: "+1 (555) 123-4567",
        gender: "Male",
        college: "vartak",
        teamName: "testing",
        role: "Leader",
        github: "https://github.com/speedracer",
        meals: {
            breakfast1: true,
            lunch1: false,
            dinner1: true,
            breakfast2: false,
            lunch2: true
        }
    };

    const mockUserDetails = { ...defaultDetails, ...userDetails };

    if (!isOpen) return null;

    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            onClose();
        }
    };

    const completedMeals = Object.values(mockUserDetails.meals).filter(Boolean).length;
    const totalMeals = Object.keys(mockUserDetails.meals).length;
    const completionRate = Math.round((completedMeals / totalMeals) * 100);

    return (
        <div
            className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-gray-800 backdrop-blur-sm flex justify-center items-center z-50 p-4"
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
                className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-yellow-400 shadow-2xl relative"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-mono font-bold text-yellow-400 mb-2 tracking-wide">
                            DRIVER PROFILE
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

                {/* Tab Navigation */}
                <div className="flex mb-6 bg-black/30 rounded-2xl p-2">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex-1 py-3 px-4 rounded-xl font-mono font-bold transition-all duration-300 ${
                            activeTab === 'profile' 
                                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black' 
                                : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10'
                        }`}
                    >
                        Profile Info
                    </button>
                    <button
                        onClick={() => setActiveTab('fuel')}
                        className={`flex-1 py-3 px-4 rounded-xl font-mono font-bold transition-all duration-300 ${
                            activeTab === 'fuel' 
                                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black' 
                                : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10'
                        }`}
                    >
                        Fuel Status
                    </button>
                </div>

                {activeTab === 'profile' && (
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Main Profile Section */}
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300">
                            <div className="flex items-center mb-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-black text-3xl font-mono font-bold mr-6 shadow-lg border-2 border-yellow-300 hover:scale-105 transition-transform duration-300 cursor-pointer">
                                    {mockUserDetails.username.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-mono font-bold text-yellow-400 mb-1 tracking-wide">
                                        {mockUserDetails.username}
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                        <Trophy className="w-4 h-4 text-yellow-500" />
                                        <span className="text-gray-400 font-mono text-sm">Active Racer</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <DetailItem
                                    icon={<Mail className="w-5 h-5" />}
                                    label="Email"
                                    value={mockUserDetails.email}
                                />
                                <DetailItem
                                    icon={<Phone className="w-5 h-5" />}
                                    label="Phone"
                                    value={mockUserDetails.phoneNumber}
                                />
                                <DetailItem
                                    icon={<User className="w-5 h-5" />}
                                    label="Gender"
                                    value={mockUserDetails.gender}
                                />
                                <DetailItem
                                    icon={<School className="w-5 h-5" />}
                                    label="College"
                                    value={mockUserDetails.college}
                                />
                                <DetailItem
                                    icon={<Users className="w-5 h-5" />}
                                    label="Team"
                                    value={mockUserDetails.teamName}
                                    highlight
                                />
                                <DetailItem
                                    icon={<Zap className="w-5 h-5" />}
                                    label="Role"
                                    value={mockUserDetails.role}
                                    highlight
                                />
                            </div>
                        </div>

                        {/* GitHub Section */}
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300">
                            <div className="flex items-center mb-6">
                                <div className="p-3 bg-yellow-400/20 rounded-full mr-4">
                                    <Github className="w-6 h-6 text-yellow-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-mono font-bold text-yellow-400 tracking-wide">
                                        CODE REPOSITORY
                                    </h3>
                                    <div className="w-16 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mt-1"></div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <a
                                    href={mockUserDetails.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-3 p-4 bg-black/30 rounded-xl border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 hover:bg-yellow-400/5 group"
                                >
                                    <div className="p-2 bg-yellow-400/20 rounded-lg group-hover:bg-yellow-400/30 transition-colors duration-300">
                                        <Github className="w-5 h-5 text-yellow-400" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-gray-300 font-mono font-medium text-sm">GitHub Profile:</span>
                                        <div className="text-yellow-400 hover:text-yellow-300 font-mono font-bold transition-colors duration-200">
                                            View Repository →
                                        </div>
                                    </div>
                                </a>

                                {/* <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="bg-black/30 rounded-xl p-4 border border-yellow-400/20">
                                        <div className="text-2xl font-mono font-bold text-yellow-400">42</div>
                                        <div className="text-gray-400 font-mono text-sm">Commits</div>
                                    </div>
                                    <div className="bg-black/30 rounded-xl p-4 border border-yellow-400/20">
                                        <div className="text-2xl font-mono font-bold text-yellow-400">8</div>
                                        <div className="text-gray-400 font-mono text-sm">Projects</div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'fuel' && (
                    <div className="space-y-6">
                        {/* Fuel Status Overview */}
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-yellow-400/20">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <div className="p-3 bg-yellow-400/20 rounded-full mr-4">
                                        <Utensils className="w-6 h-6 text-yellow-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-mono font-bold text-yellow-400 tracking-wide">
                                            FUEL STATUS
                                        </h3>
                                        <div className="w-16 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mt-1"></div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-mono font-bold text-yellow-400">{completionRate}%</div>
                                    <div className="text-gray-400 font-mono text-sm">Completed</div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-6">
                                <div className="w-full bg-gray-700 rounded-full h-3">
                                    <div 
                                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${completionRate}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Meal Status Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(mockUserDetails.meals).map(([meal, status]) => (
                                    <div
                                        key={meal}
                                        className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:scale-105 cursor-pointer ${
                                            status
                                                ? "bg-green-900/30 border-green-500/30 hover:border-green-500/50"
                                                : "bg-red-900/30 border-red-500/30 hover:border-red-500/50"
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-full ${
                                                status ? "bg-green-600/30" : "bg-red-600/30"
                                            }`}>
                                                {status ?
                                                    <CheckCircle className="w-5 h-5 text-green-400" /> :
                                                    <XCircle className="w-5 h-5 text-red-400" />
                                                }
                                            </div>
                                            <span className="font-mono font-bold text-sm capitalize tracking-wide text-white">
                                                {meal.replace(/(\d+)/, ' $1')}
                                            </span>
                                        </div>
                                        <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                                            status
                                                ? "bg-green-600/20 text-green-300"
                                                : "bg-red-600/20 text-red-300"
                                        }`}>
                                            {status ? "DONE" : "PENDING"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const DetailItem = ({ icon, label, value, highlight = false }) => (
    <div className={`flex items-center space-x-3 p-4 rounded-xl border transition-all duration-300 hover:scale-105 cursor-pointer ${
        highlight
            ? "bg-yellow-900/20 border-yellow-400/30 hover:border-yellow-400/50"
            : "bg-black/30 border-yellow-400/20 hover:border-yellow-400/40"
    }`}>
        <div className={`p-2 rounded-lg ${
            highlight ? "bg-yellow-400/30" : "bg-yellow-400/20"
        }`}>
            <div className="text-yellow-400">
                {icon}
            </div>
        </div>
        <div className="flex-1">
            <span className="text-gray-300 font-mono font-medium text-sm">{label}:</span>
            <div className={`font-mono font-bold ${
                highlight ? "text-yellow-300" : "text-white"
            }`}>
                {value}
            </div>
        </div>
    </div>
);

export default PersonalDetailsPopup;