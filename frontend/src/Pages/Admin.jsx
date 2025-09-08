"use client"

import { useState, useEffect } from "react"
import { Search, Bell, LayoutDashboard, Activity, Calendar, Settings, RefreshCw, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function AdminDashboard() {
  const [isDark, setIsDark] = useState(true)
  const [isAnimated, setIsAnimated] = useState(false)
  const [animatedCounts, setAnimatedCounts] = useState({})
  const [mealData, setMealData] = useState({
    breakfast1Count: 0,
    breakfast2Count: 0,
    lunch1Count: 0,
    lunch2Count: 0,
    dinnerCount: 0,
    snacksCount: 0,
    totalUsers: 60,
  })
  const [isLoading, setIsLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const role = localStorage.getItem("role")
    if (!role) {
      localStorage.setItem("role", "admin")
      localStorage.setItem("email", JSON.stringify("admin@example.com"))
    }

    if (role !== "admin") {
      navigate("/login")
      return
    }
    fetchMealData()
  }, [])

  const fetchMealData = async () => {
    try {
      setIsLoading(true)
      const adminEmail = JSON.parse(localStorage.getItem("email"))
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

      if (!backendUrl) {
        const mockData = {
          breakfast1Count: 25,
          breakfast2Count: 30,
          lunch1Count: 40,
          lunch2Count: 35,
          dinnerCount: 45,
          snacksCount: 20,
          totalUsers: 60,
        }
        setMealData(mockData)
        setIsLoading(false)
        return
      }

      const response = await fetch(`${backendUrl}/api/users/getMealCounts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminEmail: adminEmail }),
      })

      if (response.ok) {
        const data = await response.json()
        setMealData(data)
      }
    } catch (error) {
      console.error("Error fetching meal counts:", error)
      const mockData = {
        breakfast1Count: 25,
        breakfast2Count: 30,
        lunch1Count: 40,
        lunch2Count: 35,
        dinnerCount: 45,
        snacksCount: 20,
        totalUsers: 60,
      }
      setMealData(mockData)
    } finally {
      setIsLoading(false)
    }
  }

  const convertedMealData = {
    day1: {
      breakfast: {
        eaten: mealData.breakfast1Count || 0,
        notEaten: (mealData.totalUsers || 60) - (mealData.breakfast1Count || 0),
        total: mealData.totalUsers || 60,
      },
      lunch: {
        eaten: mealData.lunch1Count || 0,
        notEaten: (mealData.totalUsers || 60) - (mealData.lunch1Count || 0),
        total: mealData.totalUsers || 60,
      },
      snacks: {
        eaten: mealData.snacksCount || 0,
        notEaten: (mealData.totalUsers || 60) - (mealData.snacksCount || 0),
        total: mealData.totalUsers || 60,
      },
      dinner: {
        eaten: mealData.dinnerCount || 0,
        notEaten: (mealData.totalUsers || 60) - (mealData.dinnerCount || 0),
        total: mealData.totalUsers || 60,
      },
    },
    day2: {
      breakfast: {
        eaten: mealData.breakfast2Count || 0,
        notEaten: (mealData.totalUsers || 60) - (mealData.breakfast2Count || 0),
        total: mealData.totalUsers || 60,
      },
      lunch: {
        eaten: mealData.lunch2Count || 0,
        notEaten: (mealData.totalUsers || 60) - (mealData.lunch2Count || 0),
        total: mealData.totalUsers || 60,
      },
    },
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isAnimated && !isLoading) {
      const mealKeys = ["day1.breakfast", "day1.lunch", "day1.snacks", "day1.dinner", "day2.breakfast", "day2.lunch"]

      mealKeys.forEach((key) => {
        const targetValue = key.split(".").reduce((obj, prop) => obj[prop], convertedMealData)?.eaten || 0
        let currentValue = 0
        const increment = targetValue / 60

        const countUp = () => {
          currentValue += increment
          if (currentValue >= targetValue) {
            setAnimatedCounts((prev) => ({ ...prev, [key]: targetValue }))
          } else {
            setAnimatedCounts((prev) => ({ ...prev, [key]: Math.floor(currentValue) }))
            requestAnimationFrame(countUp)
          }
        }

        setTimeout(() => countUp(), 500)
      })
    }
  }, [isAnimated, isLoading, mealData])

  const handleScannerClick = () => {
    navigate("/admin")
  }

  const handleUserListClick = () => {
    navigate("/userlist")
  }

  const handleSignupClick = () => {
    navigate("/signup")
  }

  const handleLogout = () => {
    localStorage.removeItem("role")
    localStorage.removeItem("email")
    navigate("/login")
  }

  const CircularProgress = ({ eaten, total, size = 120, mealKey }) => {
    const percentage = (eaten / total) * 100
    const radius = (size - 20) / 2
    const circumference = 2 * Math.PI * radius
    const strokeDasharray = circumference
    const strokeDashoffset = isAnimated ? circumference - (percentage / 100) * circumference : circumference

    return (
      <div
        className="relative flex items-center justify-center transform transition-all duration-500 ease-out hover:scale-105"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="transform -rotate-90 transition-transform duration-300 ease-out">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-white/60 opacity-50 transition-opacity duration-500 ease-out"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="text-gray-800 transition-all duration-[2500ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-light transition-all duration-300 ease-out">
            {animatedCounts[mealKey] || 0}
          </span>
        </div>
      </div>
    )
  }

  const Legend = ({ eaten, notEaten, total }) => {
    const eatenPercentage = Math.round((eaten / total) * 100)
    const notEatenPercentage = Math.round((notEaten / total) * 100)

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
            <span className="text-sm">Eaten</span>
          </div>
          <span className="text-sm font-medium">{eatenPercentage}%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 border border-black rounded-full"></div>
            <span className="text-sm">Not Eaten</span>
          </div>
          <span className="text-sm font-medium">{notEatenPercentage}%</span>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-gray-600">Loading meal data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-all duration-700 ease-out ${isDark ? "dark bg-slate-100" : "bg-gray-50"}`}>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-slate-200 text-white p-6 min-h-screen transition-all duration-500 ease-out">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <img
              src="https://i.postimg.cc/g25645rx/Screenshot-2025-09-07-at-8-02-56-PM-Photoroom.png"
              className="w-auto h-16 object-cover"
            />
          </div>

          {/* Profile */}
          <div className="mb-14 mt-12 text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden bg-gray-600">
              <img
                src="https://i.pinimg.com/736x/4e/7c/53/4e7c53e7d136ab654ec3b004eeec3e72.jpg"
                alt="Admin"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-sm text-black font-medium">Admin</div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 mb-8">
            <div className="flex items-center gap-3 px-3 py-2 bg-gray-700 rounded-xl transition-all duration-300 ease-out">
              <LayoutDashboard className="w-4 h-8 transition-transform duration-200 ease-out" />
              <span className="text-lg font-light">Dashboard</span>
            </div>
            <div
              onClick={handleScannerClick}
              className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl cursor-pointer transition-all duration-300 ease-out hover:transform hover:translate-x-1"
            >
              <Activity className="w-4 h-8 transition-transform duration-200 ease-out" />
              <span className="text-lg font-light">Scanner</span>
            </div>
            <div
              onClick={handleUserListClick}
              className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl cursor-pointer transition-all duration-300 ease-out hover:transform hover:translate-x-1"
            >
              <Calendar className="w-4 h-8 transition-transform duration-200 ease-out" />
              <span className="text-lg font-light">User List</span>
            </div>
            <div
              onClick={handleSignupClick}
              className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl cursor-pointer transition-all duration-300 ease-out hover:transform hover:translate-x-1"
            >
              <Settings className="w-4 h-8 transition-transform duration-200 ease-out" />
              <span className="text-lg font-light">SignUp</span>
            </div>
          </nav>

          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-xl cursor-pointer transition-all duration-300 ease-out hover:transform hover:translate-x-1 w-full"
            >
              <LogOut className="w-4 h-8 transition-transform duration-200 ease-out" />
              <span className="text-lg font-light">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-thin text-black transition-all duration-500 ease-out">Meal Statistics</h1>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-all duration-200 ease-out" />
                <input
                  placeholder="Search something..."
                  className="pl-10 w-64 bg-slate-200 shadow-2xl text-black placeholder-gray-400 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ease-out focus:transform focus:scale-105"
                />
              </div>
              <button
                onClick={fetchMealData}
                className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-full font-medium transition-all duration-300 ease-out hover:transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button className="text-gray-400 hover:text-black p-2 transition-all duration-300 ease-out hover:transform hover:scale-110">
                <Bell className="w-5 h-5 transition-transform duration-200 ease-out" />
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="bg-white rounded-2xl shadow-sm p-4 inline-block">
              <div className="text-sm text-gray-600">Total Users</div>
              <div className="text-2xl font-bold text-black">{mealData.totalUsers}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Day 1 Breakfast Card */}
            <div className="bg-yellow-300 text-black rounded-3xl shadow-3xl p-6 transition-all duration-500 ease-out hover:transform  hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold transition-all duration-300 ease-out">Day 1 Breakfast</h3>
                <span className="text-sm text-gray-700 hover:text-gray-900 cursor-pointer transition-all duration-200 ease-out">
                  More
                </span>
              </div>
              <div className="flex flex-col items-center">
                <CircularProgress
                  eaten={convertedMealData.day1.breakfast.eaten}
                  total={convertedMealData.day1.breakfast.total}
                  mealKey="day1.breakfast"
                />
                <div className="mt-4 w-full">
                  <Legend
                    eaten={convertedMealData.day1.breakfast.eaten}
                    notEaten={convertedMealData.day1.breakfast.notEaten}
                    total={convertedMealData.day1.breakfast.total}
                  />
                </div>
              </div>
            </div>

            {/* Day 1 Lunch Card */}
            <div className="bg-slate-300 text-black rounded-3xl shadow-sm p-6 transition-all duration-500 ease-out hover:transform hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold transition-all duration-300 ease-out">Day 1 Lunch</h3>
                <span className="text-sm text-gray-700 hover:text-gray-900 cursor-pointer transition-all duration-200 ease-out">
                  More
                </span>
              </div>
              <div className="flex flex-col items-center">
                <CircularProgress
                  eaten={convertedMealData.day1.lunch.eaten}
                  total={convertedMealData.day1.lunch.total}
                  mealKey="day1.lunch"
                />
                <div className="mt-4 w-full">
                  <Legend
                    eaten={convertedMealData.day1.lunch.eaten}
                    notEaten={convertedMealData.day1.lunch.notEaten}
                    total={convertedMealData.day1.lunch.total}
                  />
                </div>
              </div>
            </div>

            {/* Day 1 Snacks Card */}
            <div className="bg-yellow-300 text-black rounded-3xl shadow-sm p-6 transition-all duration-500 ease-out hover:transform hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold transition-all duration-300 ease-out">Day 1 Snacks</h3>
                <span className="text-sm text-gray-700 hover:text-gray-900 cursor-pointer transition-all duration-200 ease-out">
                  More
                </span>
              </div>
              <div className="flex flex-col items-center">
                <CircularProgress
                  eaten={convertedMealData.day1.snacks.eaten}
                  total={convertedMealData.day1.snacks.total}
                  mealKey="day1.snacks"
                />
                <div className="mt-4 w-full">
                  <Legend
                    eaten={convertedMealData.day1.snacks.eaten}
                    notEaten={convertedMealData.day1.snacks.notEaten}
                    total={convertedMealData.day1.snacks.total}
                  />
                </div>
              </div>
            </div>

            {/* Day 1 Dinner Card */}
            <div className="bg-slate-300 text-black rounded-3xl shadow-sm p-6 transition-all duration-500 ease-out hover:transform hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold transition-all duration-300 ease-out">Day 1 Dinner</h3>
                <span className="text-sm text-gray-700 hover:text-gray-900 cursor-pointer transition-all duration-200 ease-out">
                  More
                </span>
              </div>
              <div className="flex flex-col items-center">
                <CircularProgress
                  eaten={convertedMealData.day1.dinner.eaten}
                  total={convertedMealData.day1.dinner.total}
                  mealKey="day1.dinner"
                />
                <div className="mt-4 w-full">
                  <Legend
                    eaten={convertedMealData.day1.dinner.eaten}
                    notEaten={convertedMealData.day1.dinner.notEaten}
                    total={convertedMealData.day1.dinner.total}
                  />
                </div>
              </div>
            </div>

            {/* Day 2 Breakfast Card */}
            <div className="bg-yellow-300 text-black rounded-3xl shadow-sm p-6 transition-all duration-500 ease-out hover:transform hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold transition-all duration-300 ease-out">Day 2 Breakfast</h3>
                <span className="text-sm text-gray-700 hover:text-gray-900 cursor-pointer transition-all duration-200 ease-out">
                  More
                </span>
              </div>
              <div className="flex flex-col items-center">
                <CircularProgress
                  eaten={convertedMealData.day2.breakfast.eaten}
                  total={convertedMealData.day2.breakfast.total}
                  mealKey="day2.breakfast"
                />
                <div className="mt-4 w-full">
                  <Legend
                    eaten={convertedMealData.day2.breakfast.eaten}
                    notEaten={convertedMealData.day2.breakfast.notEaten}
                    total={convertedMealData.day2.breakfast.total}
                  />
                </div>
              </div>
            </div>

            {/* Day 2 Lunch Card */}
            <div className="bg-gray-300 text-black rounded-3xl shadow-sm p-6 transition-all duration-500 ease-out hover:transform hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold transition-all duration-300 ease-out">Day 2 Lunch</h3>
                <span className="text-sm text-gray-700 hover:text-gray-900 cursor-pointer transition-all duration-200 ease-out">
                  More
                </span>
              </div>
              <div className="flex flex-col items-center">
                <CircularProgress
                  eaten={convertedMealData.day2.lunch.eaten}
                  total={convertedMealData.day2.lunch.total}
                  mealKey="day2.lunch"
                />
                <div className="mt-4 w-full">
                  <Legend
                    eaten={convertedMealData.day2.lunch.eaten}
                    notEaten={convertedMealData.day2.lunch.notEaten}
                    total={convertedMealData.day2.lunch.total}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Meal Counts Table */}
          <div className="mt-8 bg-white rounded-3xl shadow-sm p-6 transition-all duration-500 ease-out hover:shadow-lg">
            <h2 className="text-2xl font-bold text-black mb-6 transition-all duration-300 ease-out">Meal Counts</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-black transition-all duration-200 ease-out">
                      Meal Type
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-black transition-all duration-200 ease-out">
                      Count
                    </th>
                  </tr>
                </thead>
                <tbody className="text-black">
                  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ease-out">
                    <td className="py-3 px-4 transition-all duration-200 ease-out">Day 1 Breakfast</td>
                    <td className="py-3 px-4 text-right font-medium transition-all duration-200 ease-out">
                      {convertedMealData.day1.breakfast.eaten}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ease-out">
                    <td className="py-3 px-4 transition-all duration-200 ease-out">Day 1 Lunch</td>
                    <td className="py-3 px-4 text-right font-medium transition-all duration-200 ease-out">
                      {convertedMealData.day1.lunch.eaten}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ease-out">
                    <td className="py-3 px-4 transition-all duration-200 ease-out">Day 1 Snacks</td>
                    <td className="py-3 px-4 text-right font-medium transition-all duration-200 ease-out">
                      {convertedMealData.day1.snacks.eaten}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ease-out">
                    <td className="py-3 px-4 transition-all duration-200 ease-out">Day 1 Dinner</td>
                    <td className="py-3 px-4 text-right font-medium transition-all duration-200 ease-out">
                      {convertedMealData.day1.dinner.eaten}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ease-out">
                    <td className="py-3 px-4 transition-all duration-200 ease-out">Day 2 Breakfast</td>
                    <td className="py-3 px-4 text-right font-medium transition-all duration-200 ease-out">
                      {convertedMealData.day2.breakfast.eaten}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-all duration-200 ease-out">
                    <td className="py-3 px-4 transition-all duration-200 ease-out">Day 2 Lunch</td>
                    <td className="py-3 px-4 text-right font-medium transition-all duration-200 ease-out">
                      {convertedMealData.day2.lunch.eaten}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
