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
        const response = await axios.get(
          `http://localhost:3000/api/users/userDetails/${userId}`
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, [user]); // Dependency array includes `user`, so it will refetch when user changes

  return (
    <div className="">
      <div className="absolute -z-50 h-screen w-screen">
        <img
          src="../../public/bgblack.jpg"
          className="h-full w-full object-cover bg-no-repeat"
        />
      </div>
      <div className="hidden md:flex justify-center items-center mx-auto h-screen ">
        <div className="w-[80%] rounded-xl p-4 text-center bg-opacity-90 bg-red-300 backdrop-blur-sm">
          {userData ? (
            <p className="text-blue-500 text-4xl font-extrabold">
              Welcome, {userData.username}
            </p>
          ) : (
            <p className="text-blue-500 text-4xl font-extrabold">
              Welcome, User
            </p>
          )}
          <p className="text-red-500 text-3xl pt-5 font-bold">
            Unfortunately this website is only for mobile view only
          </p>
        </div>
      </div>
      <div className="md:hidden flex flex-col justify-evenly items-center h-screen ">
        <div className="border p-3 rounded-xl mix-blend-diff ">
          {/* Conditionally rendering the user's name */}
          {userData ? (
            <div className="p-1">
              <h1 className="text-white  text-4xl text-center ">
                Welcome, {userData.username}
              </h1>
              <p className="text-gray-300">Email: {userData.email}</p>
              <p className="text-gray-300">Meal Statuses:</p>
              <ul className="text-gray-300">
                <li className="flex">
                  Breakfast 1:{" "}
                  {userData.meals.breakfast1 ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 stroke-green-500 stroke-1 fill-green-500"
                      viewBox="0 0 448 512"
                    >
                      <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 fill-red-500"
                      viewBox="0 0 384 512"
                    >
                      <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                    </svg>
                  )}
                </li>
                <li className="flex">
                  Breakfast 2:{" "}
                  {userData.meals.breakfast2 ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 stroke-green-500 stroke-1 fill-green-500"
                      viewBox="0 0 448 512"
                    >
                      <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 fill-red-500"
                      viewBox="0 0 384 512"
                    >
                      <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                    </svg>
                  )}
                </li>
                <li className="flex">
                  Lunch:{" "}
                  {userData.meals.lunch ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 stroke-green-500 stroke-1 fill-green-500"
                      viewBox="0 0 448 512"
                    >
                      <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 fill-red-500"
                      viewBox="0 0 384 512"
                    >
                      <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                    </svg>
                  )}
                </li>
                <li className="flex">
                  Dinner:{" "}
                  {userData.meals.dinner ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 stroke-green-500 stroke-1 fill-green-500"
                      viewBox="0 0 448 512"
                    >
                      <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 fill-red-500"
                      viewBox="0 0 384 512"
                    >
                      <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                    </svg>
                  )}
                </li>
              </ul>
            </div>
          ) : (
            <p className="text-gray-300">Loading user data...</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <button
            className={`text-2xl text-white border-2 p-2 rounded-xl transition 
            ${userData?.meals.breakfast1
                ? "border-white opacity-50 hover-scale:95 cursor-not-allowed "
                : "bg-red-500 border-green-800 outline outline-offset-1 outline-green-500"
              }`}
            onClick={() => generateQRCode("breakfast1")}
            disabled={userData?.meals.breakfast1} // Disable if breakfast1 is already used
          >
            Breakfast 1
          </button>
          <button
            className={`text-2xl text-white border-2 p-2 rounded-xl transition 
            ${userData?.meals.breakfast2
                ? "border-white opacity-50 hover-scale:95 cursor-not-allowed"
                : "bg-red-500 border-red-800"
              }`}
            onClick={() => generateQRCode("breakfast2")}
            disabled={userData?.meals.breakfast2} // Disable if breakfast2 is already used
          >
            Breakfast 2
          </button>
          <button
            className={`text-2xl text-white border-2 p-2 rounded-xl transition 
            ${userData?.meals.lunch
                ? "border-white opacity-50 hover-scale:95 cursor-not-allowed"
                : "bg-red-500 border-red-800"
              }`}
            onClick={() => generateQRCode("lunch")}
            disabled={userData?.meals.lunch} // Disable if lunch is already used
          >
            Lunch
          </button>
          <button
            className={`text-2xl text-white border-2 p-2 rounded-xl transition 
            ${userData?.meals.dinner
                ? "border-white opacity-50 hover-scale:95 cursor-not-allowed"
                : "bg-red-500 border-red-800"
              }`}
            onClick={() => generateQRCode("dinner")}
            disabled={userData?.meals.dinner} // Disable if dinner is already used
          >
            Dinner
          </button>
        </div>

      </div>

    </div>
  );
};

export default Homepage;
