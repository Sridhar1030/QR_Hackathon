import React, { useEffect, useState } from "react";
import { User, Users, Utensils, Gamepad2, MapPin, AlertTriangle, Zap, Trophy, Star, Clock } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import TeamDetailsPopup from "../TeamDetailsPopup";
import PersonalDetailsPopup from "../PersonalDetailsPopup";
import GamesPopup from "../GamesPopup";
import image from "../Blank_board.svg";
import MapPopup from "../MapPopup";


const Homepage = () => {
  const [userData, setUserData] = useState(null);
  const [currentMeal, setCurrentMeal] = useState("");
  const [error, setError] = useState(null);
  const [isTeamPopupOpen, setIsTeamPopupOpen] = useState(false);
  const [teamDetails, setTeamDetails] = useState([]);
  const [isPersonalPopupOpen, setIsPersonalPopupOpen] = useState(false);
  const [isGamesPopupOpen, setIsGamesPopupOpen] = useState(false);
  const [isMapPopupOpen, setIsMapPopupOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animatedBg, setAnimatedBg] = useState(0);

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;


  const handleOpenMap = () => setIsMapPopupOpen(true);
  const handleCloseMap = () => setIsMapPopupOpen(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = "demo-user-id";
        // const userId = localStorage.getItem("id");
        if (!userId) {
          throw new Error("No user ID found in localStorage");
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        //   const response = await axios.get(
        //   `${backendUrl}/api/users/getUserDetailsById/${userId}`
        // );
        // setUserData(response.data.user);

        // Mock user data
        setUserData({
          teamName: "test team",
          username: "SPEED DEMON",
        });
      } catch (error) {
        console.error("Error fetching user data", error);
        setError("Failed to load user data. Please try logging in again.");
      }
    };

    fetchUserData();
    updateCurrentMeal();
  }, []);

  const updateCurrentMeal = () => {
    const now = new Date();
    const currentDate = now.toLocaleDateString();
    const day1 = new Date('2025-09-26').toLocaleDateString();
    const day2 = new Date('2025-09-27').toLocaleDateString();
    const hour = now.getHours();
    const minute = now.getMinutes();

    if (currentDate === day1) {
      if (hour === 9 && minute >= 0 && minute < 60) {
        setCurrentMeal("breakfast1");
      } else if ((hour === 12 && minute >= 0) || (hour >= 1 && hour < 14) || (hour === 14 && minute < 60)) {
        setCurrentMeal("lunch1");
      } else if (hour === 17 && minute >= 15 && minute < 60) {
        setCurrentMeal("snacks");
      } else if (hour === 20 && minute >= 0 && minute < 120) {
        setCurrentMeal("dinner");
      } else {
        setCurrentMeal(null);
      }
    } else if (currentDate === day2) {
      if (hour === 8 && minute >= 0 && minute < 60) {
        setCurrentMeal("breakfast2");
      } else if ((hour === 12 && minute >= 0) || (hour >= 1 && hour < 17) || (hour === 17 && minute < 60)) {
        setCurrentMeal("lunch2");
      } else {
        setCurrentMeal(null);
      }
    } else {
      setCurrentMeal(null);
    }
  };

  const handleTeamDetailsClick = async () => {
    if (userData?.teamName) {
      try {
        // const response = await axios.post(
        //   `${backendUrl}/api/users/getTeamDetailsByTeamName`,
        //   { teamName: userData.teamName }
        //);

        // mock team data
        setTeamDetails([
          { name: "Speed Racer" },
          { name: "Pit Master" },
          { name: "Strategy King" }
        ]);

        //turned off due to testing sing hardcoded data
        // setTeamDetails(response.data.member);
        setIsTeamPopupOpen(true);
      } catch (error) {
        console.error("Error fetching team details", error);
        setError("Failed to load team details. Please try again.");
      }
    } else {
      setError("Team name not available. Please update your profile.");
    }

  };

  const handlePersonalDetailsClick = () => {
    setIsPersonalPopupOpen(true);
  };

  const handleGamesClick = () => {
    setIsGamesPopupOpen(true);
  };

  const handleMealClick = async () => {
    console.log("Navigating to QR code...");
    navigate('/qrcode');
  };

  const handleMapClick = () => {
    setIsMapPopupOpen(true);
  };

  // const handleLoginRedirect = () => {
  //   console.log("Redirecting to login...");
  // };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden flex items-center justify-center p-4">
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

        <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl border-2 border-red-600 shadow-2xl shadow-red-600/20 relative overflow-hidden z-10 max-w-md">
          <div className="absolute top-4 right-4 flex space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-75"></div>
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse delay-150"></div>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-red-600/20 rounded-full border-2 border-red-500/50">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <strong className="font-black text-red-400 text-xl font-mono tracking-wider">SYSTEM ERROR</strong>
              <p className="text-gray-300 mt-1 font-mono">{error}</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-4 px-8 rounded-full font-black font-mono tracking-wider hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-yellow-400/50 border-2 border-yellow-600"
          >
            RETURN TO LOGIN
          </button>
        </div>
      </div>
    );
  }

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

      {/* Message for larger screens */}
      <div className="hidden lg:flex items-center justify-center h-screen text-white text-2xl font-bold z-10 relative">
        <div className="bg-gradient-to-br from-gray-900 to-black p-12 rounded-3xl border-2 border-red-600 shadow-2xl shadow-red-600/20 relative overflow-hidden max-w-2xl">
          <div className="absolute top-4 right-4 flex space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-75"></div>
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse delay-150"></div>
          </div>

          <div className="text-center">
            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-yellow-400 leading-tight font-mono tracking-wider mb-4">
              MOBILE ONLY
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-yellow-400 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 leading-relaxed font-mono">
              Switch to mobile for the full pit crew experience.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile view */}
      <div className="lg:hidden flex flex-col h-full z-10 relative">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 flex-1">
          {/* Enhanced header section */}
          <div className="text-center mb-8">
            <div className="relative mb-8">
              <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-yellow-400 leading-tight font-mono tracking-wider transform hover:scale-105 transition-transform duration-300">
                RACE HQ
                <br />
                <span className="text-3xl md:text-4xl bg-gradient-to-r from-yellow-400 to-white bg-clip-text text-transparent">
                  COMMAND CENTER
                </span>
              </h1>
            </div>

            {/* Team and user info card */}
            <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-3xl border-2 border-red-600 shadow-2xl shadow-red-600/20 relative overflow-hidden mb-8">
              <div className="absolute top-4 right-4 flex space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse delay-150"></div>
              </div>

              <div className="text-center">
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-orange-500 mb-2 tracking-wider font-mono">
                  {userData?.teamName || "LOADING..."}
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-yellow-400 mx-auto mb-4"></div>
                <h3 className="text-xl text-white font-bold tracking-wider font-mono">
                  PILOT: {userData?.username || "RACER"}
                </h3>
              </div>
            </div>
          </div>

          {/* Enhanced button section */}
          <div className="space-y-4">
            <RacingButton
              onClick={handlePersonalDetailsClick}
              icon={<User className="w-6 h-6" />}
              label="PERSONAL DATA"
              subtitle="Driver Profile"
              priority="high"
            />

            <RacingButton
              onClick={handleTeamDetailsClick}
              icon={<Users className="w-6 h-6" />}
              label="TEAM ROSTER"
              subtitle="Pit Crew Data"
              priority="medium"
            />

            <RacingButton
              onClick={handleMealClick}
              disabled={!currentMeal}
              icon={<Utensils className="w-6 h-6" />}
              label={currentMeal ? "FUEL STATION" : "PIT CLOSED"}
              subtitle={currentMeal ? `${currentMeal.toUpperCase()} AVAILABLE` : "No fuel available"}
              priority={currentMeal ? "high" : "disabled"}
              pulse={currentMeal}
            />

            <RacingButton
              onClick={handleGamesClick}
              icon={<Gamepad2 className="w-6 h-6" />}
              label="RACING ARCADE"
              subtitle="Game Center"
              priority="medium"
            />

            <RacingButton
              onClick={handleMapClick}
              icon={<MapPin className="w-6 h-6" />}
              label="TRACK MAP"
              subtitle="Circuit Layout"
              priority="high"
            />
          </div>
        </main>
      </div>

      <TeamDetailsPopup
        isOpen={isTeamPopupOpen}
        onClose={() => setIsTeamPopupOpen(false)}
        teamDetails={teamDetails}
      />
      <PersonalDetailsPopup
        isOpen={isPersonalPopupOpen}
        onClose={() => setIsPersonalPopupOpen(false)}
        userDetails={userData}
      />

      <GamesPopup
        isOpen={isGamesPopupOpen}
        onClose={() => setIsGamesPopupOpen(false)}
      />
      <MapPopup
        isOpen={isMapPopupOpen}
        onClose={() => setIsMapPopupOpen(false)}
      />

      <MapPopup
        isOpen={isMapPopupOpen}
        onClose={handleCloseMap}
      />
    </div>
  );
};

const RacingButton = ({ children, onClick, disabled = false, icon, label, subtitle, priority, pulse = false }) => (
  <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-3xl border-2 border-red-600 shadow-2xl shadow-red-600/20 relative overflow-hidden">
    <div className="absolute top-4 right-4 flex space-x-2">
      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-75"></div>
      <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse delay-150"></div>
    </div>

    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full transition-all duration-300 ${
        disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'transform hover:scale-105 active:scale-95'
      } ${pulse ? 'animate-pulse' : ''}`}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full border-2 ${
          priority === 'high' 
            ? 'bg-red-600/20 border-red-500/50' 
            : priority === 'medium'
            ? 'bg-gray-700/50 border-gray-600/50'
            : 'bg-gray-800/50 border-gray-700/30'
        }`}>
          {icon}
        </div>
        <div className="flex-1 text-left">
          <div className="text-lg font-black text-yellow-400 font-mono tracking-wider">
            {label}
          </div>
          <div className="text-sm text-gray-300 font-mono">
            {subtitle}
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 rounded-full font-black font-mono tracking-wider hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 border-2 border-yellow-600 text-sm">
          ACCESS
        </div>
      </div>
    </button>
  </div>
);

const EnhancedPopup = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl border-2 border-red-600 shadow-2xl shadow-red-600/20 relative overflow-hidden max-w-md w-full">
      <div className="absolute top-4 right-4 flex space-x-2">
        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-75"></div>
        <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse delay-150"></div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 tracking-wider font-mono">
          {title}
        </h3>
        <button
          onClick={onClose}
          className="w-8 h-8 bg-red-600/20 hover:bg-red-600/40 rounded-full flex items-center justify-center transition-colors duration-200 font-black text-red-400"
        >
          ×
        </button>
      </div>

      {/* Racing divider */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="h-0.5 flex-1 bg-gradient-to-r from-red-600 to-yellow-400"></div>
        <Zap className="w-4 h-4 text-red-500" />
        <div className="h-0.5 flex-1 bg-gradient-to-r from-yellow-400 to-red-600"></div>
      </div>

      {children}

      <button
        onClick={onClose}
        className="w-full mt-6 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-4 rounded-full font-black font-mono tracking-wider hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-yellow-400/50 border-2 border-yellow-600"
      >
        CLOSE TERMINAL
      </button>
    </div>
  </div>
);

export default Homepage;