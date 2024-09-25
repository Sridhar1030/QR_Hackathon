import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Homepage = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const generateQRCode = async (mealType) => {
    if (!userData) {
      console.error("User data is not loaded yet.");
      return;
    }

    const qrCodeData = {
      userId: userData._id, // Assuming you have _id as the user ID in the fetched data
      meal: mealType,
    };

    try {
      const qrCode = await QRCode.toDataURL(JSON.stringify(qrCodeData));
      setQrCodeUrl(qrCode);

      // Navigate to the QRCodePage and pass the generated qrCodeUrl
      navigate("/qrcode", { state: { qrCodeUrl: qrCode , mealType } });
    } catch (error) {
      console.error("Error generating QR code", error);
    }
  };

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      const user = localStorage.getItem("user");
      if (!user) {
        console.error("No user ID found in localStorage");
        return;
      }

      const userId = JSON.parse(user).user.id;
      console.log(userId)

      try {
        const response = await axios.get(`http://localhost:3000/api/users/userDetails/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, []);

  console.log(userData)

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-800">


      <div>

      </div>
      <div className="grid grid-cols-2 gap-8 mb-8">
        <button
          className="text-3xl bg-red-500 border-2 border-red-800 p-5 rounded-xl"
          onClick={() => generateQRCode("breakfast1")}
        >
          breakfast1
        </button>
        <button
          className="text-3xl bg-red-500 border-2 border-red-800 p-5 rounded-xl"
          onClick={() => generateQRCode("breakfast2")}
        >
          breakfast2
        </button>
        <button
          className="text-3xl bg-red-500 border-2 border-red-800 p-5 rounded-xl"
          onClick={() => generateQRCode("lunch")}
        >
          lunch
        </button>
        <button
          className="text-3xl bg-red-500 border-2 border-red-800 p-5 rounded-xl"
          onClick={() => generateQRCode("dinner")}
        >
          dinner
        </button>
      </div>
    </div>
  );
};

export default Homepage;
