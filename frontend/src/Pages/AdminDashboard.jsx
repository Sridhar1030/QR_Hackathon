import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom"; // For navigation
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Register components for chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
    const [mealData, setMealData] = useState({
        breakfast1Count: 0,
        breakfast2Count: 0,
        lunch1Count: 0, 
        lunch2Count: 0,   
        dinnerCount: 0,
        snacksCount: 0,   
    });
    

  const adminEmail = JSON.parse(localStorage.getItem("email"));
  const navigate = useNavigate(); // To handle redirection

  useEffect(() => {
    const fetchAdmin = async () => {
      const role = localStorage.getItem("role");

      if (role === "admin") {
        try {
          const response = await axios.post(
            `${backendUrl}/api/users/getMealCounts`,
            { adminEmail: adminEmail }
          );
          console.log(response.data);
          setMealData(response.data); // Update state with fetched data
        } catch (error) {
          console.error("Error fetching meal counts:", error);
        }
      }
    };

    fetchAdmin();
  }, [adminEmail]);

  // Handle button click to navigate to /admin
  const handleScannerClick = () => {
    navigate("/admin");
  };

  
const breakfast1Count = {
    labels: ["Users who haven't eaten", "Users who have eaten"], 
    datasets: [
      {
        label: "",
        data: [mealData.totalUsers - mealData.breakfast1Count, mealData.breakfast1Count], 
        backgroundColor: ["#FF6384", "#36A2EB"], 
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const lunch1Count = {
    labels: ["Users who haven't eaten", "Users who have eaten"], // Clearer labels
    datasets: [
      {
        label: "",
        data: [mealData.totalUsers - mealData.lunch1Count , mealData.lunch1Count],
        backgroundColor: ["#FF6384", "#36A2EB"], 
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };
  const lunch2Count = {
    labels: ["Users who haven't eaten", "Users who have eaten"], // Clearer labels
    datasets: [
      {
        label: "",
        data: [mealData.totalUsers - mealData.lunch2Count , mealData.lunch2Count],
        backgroundColor: ["#FF6384", "#36A2EB"], 
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const snacksCount = {
    labels: ["Users who haven't eaten", "Users who have eaten"], // Clearer labels
    datasets: [
      {
        label: "",
        data: [mealData.totalUsers - mealData.snacksCount , mealData.snacksCount],
        backgroundColor: ["#FF6384", "#36A2EB"], 
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const dinnerCount = {
    labels: ["Users who haven't eaten", "Users who have eaten"], // Clearer labels
    datasets: [
      {
        label: "",
        data: [mealData.totalUsers - mealData.dinnerCount, mealData.dinnerCount], 
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const breakfast2Count = {
    labels: ["Users who haven't eaten", "Users who have eaten"], // Clearer labels
    datasets: [
      {
        label: "",
        data: [mealData.totalUsers - mealData.breakfast2Count, mealData.breakfast2Count],
        backgroundColor: ["#FF6384", "#36A2EB"], 
        hoverBackgroundColor: ["#FF6384", "#36A2EB"], 
      },
    ],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Change legend position
      },
    },
  };

  // Chart data for Bar graph
  const chartData = {
    labels: ["Day 1 Breakfast", "Day 1 Lunch", " Day 1 Dinner", "Day 2 Breakfast"],
    datasets: [
      {
        label: "Meal Count",
        data: [
          mealData.breakfast1Count,
          mealData.lunchCount,
          mealData.dinnerCount,
          mealData.breakfast2Count,
        ],
        backgroundColor: [
          "#60a5fa", // Blue for Breakfast 1
          "#34d399", // Green for Breakfast 2
          "#fbbf24", // Yellow for Lunch
          "#f87171", // Red for Dinner
        ],
        borderRadius: 10,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Scanner Button */}
      <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4">
        <button
          className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition-colors duration-200"
          onClick={handleScannerClick}
        >
          Scanner
        </button>
        <button
          className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition-colors duration-200"
          onClick={() => navigate("/userlist")}
        >
          User List
        </button>
        <button
          className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition-colors duration-200"
          onClick={() => navigate("/signup")}
        >
          Signup
        </button>
      </div>

      <div className="mb-8">
        <table className="min-w-full bg-white border border-gray-300 text-xl font-bold rounded-lg shadow-lg">
          <tr className="border-b ">
            <td className="py-3 px-6">User count</td>
            <td className="py-3 px-6">{mealData.totalUsers}</td>
          </tr>
        </table>
      </div>
      {/* Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Meal Counts</h2>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-6 text-left">Meal Type</th>
              <th className="py-3 px-6 text-left">Count</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-3 px-6">Day 1 Breakfast</td>
              <td className="py-3 px-6">{mealData.breakfast1Count}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 px-6">Day 1 Lunch</td>
              <td className="py-3 px-6">{mealData.lunch1Count}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 px-6">Day 1 snacks</td>
              <td className="py-3 px-6">{mealData.snacksCount}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-6">Day 1 Dinner</td>
              <td className="py-3 px-6">{mealData.dinnerCount}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 px-6">Day 2 Breakfast</td>
              <td className="py-3 px-6">{mealData.breakfast2Count}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 px-6">Day 2 Lunch</td>
              <td className="py-3 px-6">{mealData.lunch2Count}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bar Graph */}
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
        <h2 className="text-base sm:text-xl lg:text-2xl font-semibold mb-4">Day 1 Breakfast Counts Bar Graph</h2>
        <Pie data={breakfast1Count} options={options} />
    </div>

    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
        <h2 className="text-base sm:text-xl lg:text-2xl font-semibold mb-4">Day 1 Lunch Counts Bar Graph</h2>
        <Pie data={lunch1Count} options={options} />
    </div>

    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
        <h2 className="text-base sm:text-xl lg:text-2xl font-semibold mb-4">Day 1 Snacks Counts Bar Graph</h2>
        <Pie data={snacksCount} options={options} />
    </div>

    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
        <h2 className="text-base sm:text-xl lg:text-2xl font-semibold mb-4">Day 1 Dinner Counts Bar Graph</h2>
        <Pie data={dinnerCount} options={options} />
    </div>

    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
        <h2 className="text-base sm:text-xl lg:text-2xl font-semibold mb-4">Day 2 Breakfast Counts Bar Graph</h2>
        <Pie data={breakfast2Count} options={options} />
    </div>

    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
        <h2 className="text-base sm:text-xl lg:text-2xl font-semibold mb-4">Day 2 Lunch Counts Bar Graph</h2>
        <Pie data={lunch2Count} options={options} />
    </div>
    </div>


    </div>
  );
};

export default AdminDashboard;
