import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import TeamDetailsPopup from "../TeamDetailsPopup";
import PersonalDetailsPopup from "../PersonalDetailsPopup";
import GamesPopup from "../GamesPopup";
import QRCode from "qrcode";
import image from "../../../dist/Blank_board.png"
import MapPopup from "../MapPopup";

const Homepage = () => {
  const [userData, setUserData] = useState(null);
  const [currentMeal, setCurrentMeal] = useState("");
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isTeamPopupOpen, setIsTeamPopupOpen] = useState(false);
  const [teamDetails, setTeamDetails] = useState([]);
  const [isPersonalPopupOpen, setIsPersonalPopupOpen] = useState(false);
  const [isGamesPopupOpen, setIsGamesPopupOpen] = useState(false);
  const [isMapPopupOpen, setIsMapPopupOpen] = useState(false);
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;


  const handleOpenMap = () => setIsMapPopupOpen(true);
  const handleCloseMap = () => setIsMapPopupOpen(false);


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
    const day1 = new Date('2024-10-03').toLocaleDateString();
    const day2 = new Date('2024-10-04').toLocaleDateString();
    const hour = now.getHours();
    const minute = now.getMinutes();

    if (currentDate === day1) {
      // Day 1 timings
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
    }

    else if (currentDate === day2) {
      // Day 2 timings
      if (hour === 8 && minute >= 0 && minute < 60) {
        setCurrentMeal("breakfast2");
      } else if ((hour === 12 && minute >= 0) || (hour >= 1 && hour < 17) || (hour === 17 && minute < 60)) {
        setCurrentMeal("lunch2");
      } else {
        setCurrentMeal(null);
      }
    } else {
      setCurrentMeal(null); // No meals available on other days
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
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
    navigate('/qrcode');
  };

  const handleMapClick = () => {
    setIsMapPopupOpen(true);
  };

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
          <div className="text-center mb-12 flex flex-col justify-center items-center">

            <img src="../../../public/onDark(SHADOW)new.png" className="h-8" alt="" />
            <h2 className="text-4xl font-extrabold text-[#f5af64] mb-3 shadow-text mt-5">
              {userData?.teamName || "Team Name"}
            </h2>
            <h3 className="text-2xl text-white font-semibold shadow-text">
              {userData?.username || "Member Name"}
            </h3>
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
            <Button onClick={handleMapClick} bgColor="bg-[#252ac7]" hoverColor="hover:bg-[#1e22a0]">
              Map
            </Button>
            {/* <Button onClick={() => setIsMapOpen(true)} bgColor="bg-[#f5af64]" textColor="text-[#182567]" hoverColor="hover:bg-[#f3a04e]">
                  2nd Floor Map
                </Button> */}
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
