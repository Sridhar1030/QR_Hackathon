import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Homepage = () => {
  const [userData, setUserData] = useState(null);
  const [currentMeal, setCurrentMeal] = useState("");
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("id");
        if (!userId) {
          throw new Error("No user ID found in localStorage");
        }

        const response = await axios.get(
          `http://localhost:3000/api/users/getUserDetailsById/${userId}`
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

  if (error) {
    return (
      <div className="flex flex-col h-screen bg-gray-100 items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <button 
          onClick={() => navigate('/login')} 
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 relative">
      <div className="absolute inset-0 -z-10 bg-black"> {/* Fallback background color */}
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
          <button className="w-full bg-blue-500 text-white py-4 rounded-lg text-xl font-semibold hover:bg-blue-600 transition duration-300">
            Team Details
          </button>
          <button className="w-full bg-green-500 text-white py-4 rounded-lg text-xl font-semibold hover:bg-green-600 transition duration-300">
            Personal Details
          </button>
          <button className="w-full bg-red-500 text-white py-4 rounded-lg text-xl font-semibold hover:bg-red-600 transition duration-300">
            Food ({currentMeal})
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;