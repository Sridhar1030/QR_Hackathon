import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TeamDetailsPopup from "../TeamDetailsPopup";
import PersonalDetailsPopup from "../PersonalDetailsPopup";
import GamesPopup from "../GamesPopup";


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
      setCurrentMeal("Breakfast 1");
    } else if (hour >= 10 && hour < 12) {
      setCurrentMeal("Breakfast 2");
    } else if (hour >= 12 && hour < 15) {
      setCurrentMeal("Lunch");
    } else if (hour >= 18 && hour < 21) {
      setCurrentMeal("Dinner");
    } else {
      setCurrentMeal("No meal available");
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
    <div className="flex flex-col h-screen bg-gray-100 relative">
      <div className="absolute inset-0 -z-10 bg-black">
        <img
          src="/bgblack.jpg"
          className={`h-full w-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          alt="Background"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
      <div className="flex-1 flex flex-col items-center justify-between py-8 px-4 relative z-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            {userData?.teamName || "Team Name"}
          </h1>
          <h2 className="text-2xl text-white">
            {userData?.username || "Member Name"}
          </h2>
        </div>
        <div className="w-full space-y-6">
        <button 
            onClick={handlePersonalDetailsClick}
            className="w-full bg-green-500 text-white py-4 rounded-lg text-xl font-semibold hover:bg-green-600 transition duration-300"
          >
            Personal Details
          </button>
          <button 
            onClick={handleTeamDetailsClick}
            className="w-full bg-blue-500 text-white py-4 rounded-lg text-xl font-semibold hover:bg-blue-600 transition duration-300"
          >
            Team Details
          </button>
          <button className="w-full bg-red-500 text-white py-4 rounded-lg text-xl font-semibold hover:bg-red-600 transition duration-300">
            Food ({currentMeal})
          </button>
          <button 
            onClick={handleGamesClick} 
            className="w-full bg-yellow-500 text-white py-4 rounded-lg text-xl font-semibold hover:bg-yellow-600 transition duration-300"
          >
            Games
          </button>
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

export default Homepage;