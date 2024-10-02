import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

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
        lunchCount: 0,
        dinnerCount: 0
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
                    setMealData(response.data); // Update state with fetched data
                } catch (error) {
                    console.error('Error fetching meal counts:', error);
                }
            }
        };

        fetchAdmin();
    }, [adminEmail]);

    // Handle button click to navigate to /admin
    const handleScannerClick = () => {
        navigate('/admin');
    };

    // Chart data for Bar graph
    const chartData = {
        labels: ['Breakfast 1', 'Breakfast 2', 'Lunch', 'Dinner'],
        datasets: [
            {
                label: 'Meal Count',
                data: [
                    mealData.breakfast1Count,
                    mealData.breakfast2Count,
                    mealData.lunchCount,
                    mealData.dinnerCount
                ],
                backgroundColor: [
                    '#60a5fa', // Blue for Breakfast 1
                    '#34d399', // Green for Breakfast 2
                    '#fbbf24', // Yellow for Lunch
                    '#f87171'  // Red for Dinner
                ],
                borderRadius: 10,
            }
        ]
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

            {/* Scanner Button */}
            <button
                className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 mb-8"
                onClick={handleScannerClick}
            >
                Scanner
            </button>

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
                            <td className="py-3 px-6">Breakfast 1</td>
                            <td className="py-3 px-6">{mealData.breakfast1Count}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <td className="py-3 px-6">Breakfast 2</td>
                            <td className="py-3 px-6">{mealData.breakfast2Count}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <td className="py-3 px-6">Lunch</td>
                            <td className="py-3 px-6">{mealData.lunchCount}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-3 px-6">Dinner</td>
                            <td className="py-3 px-6">{mealData.dinnerCount}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Bar Graph */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Meal Counts Bar Graph</h2>
                <Bar data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default AdminDashboard;
