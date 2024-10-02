import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import TeamDetailsPopup from "../TeamDetailsPopup";
import PersonalDetailsPopup from "../PersonalDetailsPopup";
import GamesPopup from "../GamesPopup";
import QRCode from "qrcode";

const Homepage = () => {
  const [userData, setUserData] = useState(null);
  const [currentMeal, setCurrentMeal] = useState("");
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isTeamPopupOpen, setIsTeamPopupOpen] = useState(false);
  const [teamDetails, setTeamDetails] = useState([]);
  const [isPersonalPopupOpen, setIsPersonalPopupOpen] = useState(false);
  const [isGamesPopupOpen, setIsGamesPopupOpen] = useState(false);
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("id");
        if (!userId) {
          throw new Error("No user ID found in localStorage");
        }

        const response = await axios.get(
          `${backendUrl}/api/users/getUserDetailsById/${userId}`
        );
        setUserData(response.data.user);
        console.log(response.data.user);
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
    const hour = now.getHours();

    if (hour >= 6 && hour < 10) {
      setCurrentMeal("breakfast1");
    } else if (hour >= 10 && hour < 12) {
      setCurrentMeal("breakfast2");
    } else if (hour >= 12 && hour < 15) {
      setCurrentMeal("lunch");
    } else if (hour >= 18 && hour < 21) {
      setCurrentMeal("dinner");
    } else {
      setCurrentMeal(null);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    console.error("Failed to load background image");
    setImageLoaded(false);
  };

  const handleTeamDetailsClick = async () => {
    if (userData?.teamName) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/users/getTeamDetailsByTeamName`,
          { teamName: userData.teamName }
        );
        setTeamDetails(response.data.member);
        setIsTeamPopupOpen(true);
      } catch (error) {
        console.error("Error fetching team details", error);
        setError("Failed to load team details. Please try again.");
      }
    } else {
      console.error("Team name not available");
      setError("Team name not available. Please update your profile.");
    }
  };

  const handlePersonalDetailsClick = () => {
    setIsPersonalPopupOpen(true);
  };

  const handleGamesClick = () => {
    setIsGamesPopupOpen(true);
  };


  const link = "https://youtu.be/dQw4w9WgXcQ?si=Z89EeRG8ovOojrhk"
  const qrData =
  {
    userId: userData?._id,
    meal: currentMeal,
    youtube: link
  }
  console.log(qrData)

  const handleMealClick = async () => {
    console.log("meal", qrData)
    const qrCode = await QRCode.toDataURL(JSON.stringify(qrData))
    console.log(qrCode)
    console.log("Meal Clicked")
    navigate('/qrcode', { state: { qrCodeUrl: qrCode, currentMeal } })
  }
  if (error) {
    return (
      <div className="flex flex-col h-screen bg-gray-100 items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#090535] to-[#0c1577] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#f5af64] rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#252ac7] rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Message for larger screens */}
      <div className="hidden lg:flex items-center justify-center h-screen bg-[#0c15776a] text-white text-2xl font-bold z-10">
        <div className="bg-[#090535] p-8 rounded-lg shadow-lg border border-[#f5af64] backdrop-blur-sm bg-opacity-80">
          Please open on a mobile device for the best experience.
        </div>
      </div>

      {/* Mobile view */}
      <div className="lg:hidden flex flex-col h-full z-10">
        <div className="flex-1 flex flex-col items-center justify-between py-12 px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-[#f5af64] mb-3 shadow-text">
              {userData?.teamName || "Team Name"}
            </h1>
            <h2 className="text-2xl text-white font-semibold shadow-text">
              {userData?.username || "Member Name"}
            </h2>
          </div>
          <div className="w-full space-y-6">
            <Button onClick={handlePersonalDetailsClick} bgColor="bg-[#252ac7]" hoverColor="hover:bg-[#1e22a0]">
              Personal Details
            </Button>
            <Button onClick={handleTeamDetailsClick} bgColor="bg-[#f5af64]" textColor="text-[#182567]" hoverColor="hover:bg-[#f3a04e]">
              Team Details
            </Button>
            <Button
              onClick={handleMealClick}
              bgColor={currentMeal ? "bg-[#252ac7]" : "bg-gray-400"}
              hoverColor={currentMeal ? "hover:bg-[#1e22a0]" : ""}
              disabled={!currentMeal}
            >
              {currentMeal ? `Food (${currentMeal})` : "No meals available now"}
            </Button>
            <Button onClick={handleGamesClick} bgColor="bg-[#f5af64]" textColor="text-[#182567]" hoverColor="hover:bg-[#f3a04e]">
              Games
            </Button>
          </div>
        </div>
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
    </div>
  );
};

const Button = ({ children, onClick, bgColor, textColor = "text-white", hoverColor, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      w-full ${bgColor} ${textColor} ${hoverColor} 
      py-5 rounded-2xl text-xl font-semibold 
      transition duration-300 shadow-lg
      transform hover:scale-105 active:scale-95
      disabled:opacity-50 disabled:cursor-not-allowed
      backdrop-blur-sm bg-opacity-90
    `}
  >
    {children}
  </button>
);



export default Homepage;