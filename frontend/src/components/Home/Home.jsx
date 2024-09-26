import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Homepage = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate(); 
  
  // Function to generate QR code
  const generateQRCode = async (mealType) => {
    if (!userData) {
      console.error("User data is not loaded yet.");
      return;
    }

    const qrCodeData = {
      userId: userData._id, // Assuming _id is the user ID in the fetched data
      meal: mealType,
    };

    try {
      const qrCode = await QRCode.toDataURL(JSON.stringify(qrCodeData));
      setQrCodeUrl(qrCode);

      // Navigate to the QRCodePage and pass the generated qrCodeUrl
      navigate("/qrcode", { state: { qrCodeUrl: qrCode, mealType } });
    } catch (error) {
      console.error("Error generating QR code", error);
    }
  };

  const user = localStorage.getItem("data");

  // Fetch user data when the user changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        console.error("No user ID found in localStorage");
        return;
      }

      const userId = JSON.parse(user).user.id;
      console.log("Fetching user data for ID:", userId);

      try {
        const response = await axios.get(`http://localhost:3000/api/users/userDetails/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, [user]); // Dependency array includes `user`, so it will refetch when user changes

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-800">
      <div>
        {/* Conditionally rendering the user's name */}
        {userData ? (
          <>
            <h1 className="text-white">Welcome, {userData.username}</h1>
            <p className="text-gray-300">Email: {userData.email}</p>
            <p className="text-gray-300">Meal Statuses:</p>
            <ul className="text-gray-300">
              <li>Breakfast 1: {userData.meals.breakfast1 ? "Used" : "Not Used"}</li>
              <li>Breakfast 2: {userData.meals.breakfast2 ? "Used" : "Not Used"}</li>
              <li>Lunch: {userData.meals.lunch ? "Used" : "Not Used"}</li>
              <li>Dinner: {userData.meals.dinner ? "Used" : "Not Used"}</li>
            </ul>
          </>
        ) : (
          <p className="text-gray-300">Loading user data...</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <button
          className={`text-3xl border-2 p-5 rounded-xl transition 
            ${userData?.meals.breakfast1 ? "bg-red-400 border-gray-600 opacity-50 cursor-not-allowed" : "bg-red-500 border-red-800"}`}
          onClick={() => generateQRCode("breakfast1")}
          disabled={userData?.meals.breakfast1} // Disable if breakfast1 is already used
        >
          Breakfast 1
        </button>
        <button
          className={`text-3xl border-2 p-5 rounded-xl transition 
            ${userData?.meals.breakfast2 ? "bg-red-400 border-gray-600 opacity-50 cursor-not-allowed" : "bg-red-500 border-red-800"}`}
          onClick={() => generateQRCode("breakfast2")}
          disabled={userData?.meals.breakfast2} // Disable if breakfast2 is already used
        >
          Breakfast 2
        </button>
        <button
          className={`text-3xl border-2 p-5 rounded-xl transition 
            ${userData?.meals.lunch ? "bg-red-400 border-gray-600 opacity-50 cursor-not-allowed" : "bg-red-500 border-red-800"}`}
          onClick={() => generateQRCode("lunch")}
          disabled={userData?.meals.lunch} // Disable if lunch is already used
        >
          Lunch
        </button>
        <button
          className={`text-3xl border-2 p-5 rounded-xl transition 
            ${userData?.meals.dinner ? "bg-red-400 border-gray-600 opacity-50 cursor-not-allowed" : "bg-red-500 border-red-800"}`}
          onClick={() => generateQRCode("dinner")}
          disabled={userData?.meals.dinner} // Disable if dinner is already used
        >
          Dinner
        </button>
      </div>
    </div>
  );
};

export default Homepage;
