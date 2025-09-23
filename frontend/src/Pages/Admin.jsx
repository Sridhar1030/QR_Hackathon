import { useState, useEffect, useRef } from "react"
import { Search, Bell, RefreshCw, LogOut, Flag, Zap, Target, Trophy, Gauge } from "lucide-react"
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
    const [animatedPercentage, setAnimatedPercentage] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const animationRef = useRef(null)

    const percentage = (eaten / total) * 100
    const radius = (size - 20) / 2
    const circumference = 2 * Math.PI * radius

    useEffect(() => {
      if (isAnimated && !isLoading) {
        setIsAnimating(true)
        setAnimatedPercentage(0) // Reset to 0 first

        const startTime = Date.now()
        const duration = 2500 // 2.5 seconds for smooth animation

        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)

          const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1)
          const easedProgress = easeInOutCubic(progress)

          const currentPercentage = easedProgress * percentage
          setAnimatedPercentage(currentPercentage)

          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animate)
          } else {
            setIsAnimating(false)
            setTimeout(() => {
              const pulseElement = document.querySelector(`[data-speedometer="${mealKey}"]`)
              if (pulseElement) {
                pulseElement.classList.add("animate-pulse")
                setTimeout(() => pulseElement.classList.remove("animate-pulse"), 500)
              }
            }, 100)
          }
        }

        setTimeout(() => {
          animationRef.current = requestAnimationFrame(animate)
        }, 200)
      }

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }, [isAnimated, isLoading, percentage, mealKey])

    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference
    const needleRotation = (animatedPercentage / 100) * 180 - 90 // -90 to 90 degrees

    const getSpeedometerColor = (percent) => {
      if (percent < 30) return "#00FF41" // Neon green for low values
      if (percent < 60) return "#FFD700" // Racing yellow for mid values
      if (percent < 80) return "#FF8C00" // Orange for high values
      return "#FF1801" // Ferrari red for very high values
    }

    const currentColor = getSpeedometerColor(animatedPercentage)

    return (
      <div
        className="relative flex items-center justify-center transform transition-all duration-500 ease-out"
        style={{ width: size, height: size }}
        data-speedometer={mealKey}
      >
        <svg width={size} height={size} className="transform -rotate-90 transition-transform duration-300 ease-out">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius + 5}
            stroke="url(#metallicGradient)"
            strokeWidth="3"
            fill="none"
            className="opacity-80"
          />

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#333"
            strokeWidth="8"
            fill="none"
            className="opacity-50"
          />

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={currentColor}
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-100 ease-linear "
            strokeLinecap="round"
          />

          {[0, 25, 50, 75, 100].map((mark, i) => {
            const angle = (mark / 100) * 180 - 90
            const x1 = size / 2 + (radius - 15) * Math.cos((angle * Math.PI) / 180)
            const y1 = size / 2 + (radius - 15) * Math.sin((angle * Math.PI) / 180)
            const x2 = size / 2 + (radius - 5) * Math.cos((angle * Math.PI) / 180)
            const y2 = size / 2 + (radius - 5) * Math.sin((angle * Math.PI) / 180)
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#FFD700"
                strokeWidth="2"
                className="opacity-80"
                style={{ filter: "drop-shadow(0 0 2px #FFD700)" }}
              />
            )
          })}

          <defs>
            <linearGradient id="racingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00FF41" />
              <stop offset="30%" stopColor="#FFD700" />
              <stop offset="70%" stopColor="#FF8C00" />
              <stop offset="100%" stopColor="#FF1801" />
            </linearGradient>
            <linearGradient id="metallicGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c0c0c0" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#c0c0c0" />
            </linearGradient>
          </defs>
        </svg>

        <div
          className="absolute origin-bottom transition-transform duration-100 ease-linear"
          style={{
            width: "3px",
            height: radius - 10,
            background: `linear-gradient(to top, ${currentColor}, #FFD700)`,
            bottom: "50%",
            left: "50%",
            transform: `translateX(-50%) rotate(${needleRotation}deg)`,
            transformOrigin: "bottom center",
            filter: `drop-shadow(0 0 6px ${currentColor})`,
            borderRadius: "2px 2px 0 0",
          }}
        >
          <div
            className="absolute top-8 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full"
            style={{
              background: currentColor,
              boxShadow: `0 0 8px ${currentColor}, 0 0 16px ${currentColor}`,
            }}
          />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-2xl font-mono font-thin drop-shadow-lg transition-colors duration-300 "
            style={{ color: currentColor }}
          >
            {Math.round(animatedPercentage * (total / 100))}
          </span>
          <span className="text-xs font-mono text-[#c0c0c0] opacity-80 translate-y-3">CONSUMED</span>
          <div className="text-xs font-mono text-[#888] mt-1 translate-y-2">{Math.round(animatedPercentage)}%</div>
        </div>

        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex gap-1 -translate-y-5">
          {[1, 2, 3, 4, 5].map((light) => (
            <div
              key={light}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                animatedPercentage > light * 20
                  ? light <= 3
                    ? "bg-green-400 shadow-green-400"
                    : light === 4
                      ? "bg-yellow-400 shadow-yellow-400"
                      : "bg-red-500 shadow-red-500"
                  : "bg-gray-600"
              }`}
              style={{
                boxShadow:
                  animatedPercentage > light * 20
                    ? `0 0 4px ${light <= 3 ? "#4ade80" : light === 4 ? "#facc15" : "#ef4444"}`
                    : "none",
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  const Legend = ({ eaten, notEaten, total }) => {
    const eatenPercentage = Math.round((eaten / total) * 100)
    const notEatenPercentage = Math.round((notEaten / total) * 100)

    return (
      <div className="space-y-2 font-mono text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#FF1801] rounded-full shadow-lg"></div>
            <span className="text-white font-medium">CONSUMED</span>
          </div>
          <span className="text-[#FFD700] font-bold">{eatenPercentage}%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#333] border border-[#c0c0c0] rounded-full"></div>
            <span className="text-[#c0c0c0] font-medium">REMAINING</span>
          </div>
          <span className="text-[#c0c0c0] font-bold">{notEatenPercentage}%</span>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] carbon-fiber-bg flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-[#FF1801]" />
            <div className="absolute inset-0 w-12 h-12 mx-auto animate-pulse bg-[#FF1801] rounded-full opacity-20"></div>
          </div>
          <p className="text-[#FFD700] font-mono font-bold text-lg">LOADING RACE DATA...</p>
          <div className="mt-2 flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-[#FF1801] rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] carbon-fiber-bg">
      <div className="flex">
        <div className="w-64 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border-r-2 border-[#FF1801] text-white p-6 min-h-screen relative overflow-hidden">
          <div className="absolute inset-0 racing-stripes opacity-30"></div>

          <div className="flex items-center gap-3 mb-8 relative z-10">
            <div className="flex items-center gap-2">
              <img src="https://i.postimg.cc/4dGYpG5c/Screenshot-2025-09-11-at-12-41-21-PM-Photoroom.png" alt="" />
            </div>
          </div>

          <div className="mb-14 mt-12 text-center relative z-10">
            <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden p-1">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#1a1a1a]">
                <img
                  src="https://i.pinimg.com/736x/4e/7c/53/4e7c53e7d136ab654ec3b004eeec3e72.jpg"
                  alt="Pit Crew Chief"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="text-sm text-[#FFD700] font-mono font-bold">PIT CREW CHIEF</div>
            <div className="text-xs text-[#c0c0c0] font-mono">RACE CONTROL</div>
          </div>

          <nav className="space-y-2 mb-8 relative z-10">
            <div className="flex items-center gap-3 px-4 py-3 hover:text-white hover:bg-gradient-to-r hover:from-[#333] hover:to-[#555] rounded-3xl neon-glow transition-all duration-300 ease-out">
              <Gauge className="w-5 h-5 text-white" />
              <span className="text-white font-mono font-bold">DASHBOARD</span>
            </div>
            <div
              onClick={handleScannerClick}
              className="flex items-center gap-3 px-4 py-3 text-[#c0c0c0] hover:text-white hover:bg-gradient-to-r hover:from-[#333] hover:to-[#555] rounded-3xl cursor-pointer transition-all duration-300 ease-out hover:transform hover:translate-x-1 hover:neon-glow-yellow group"
            >
              <Target className="w-5 h-5 group-hover:text-[#FFD700] transition-colors duration-200" />
              <span className="font-mono font-medium">SCANNER</span>
            </div>
            <div
              onClick={handleUserListClick}
              className="flex items-center gap-3 px-4 py-3 text-[#c0c0c0] hover:text-white hover:bg-gradient-to-r hover:from-[#333] hover:to-[#555] rounded-3xl cursor-pointer transition-all duration-300 ease-out hover:transform hover:translate-x-1 hover:neon-glow-yellow group"
            >
              <Trophy className="w-5 h-5 group-hover:text-[#FFD700] transition-colors duration-200" />
              <span className="font-mono font-medium">DRIVERS</span>
            </div>
            <div
              onClick={handleSignupClick}
              className="flex items-center gap-3 px-4 py-3 text-[#c0c0c0] hover:text-white hover:bg-gradient-to-r hover:from-[#333] hover:to-[#555] rounded-3xl cursor-pointer transition-all duration-300 ease-out hover:transform hover:translate-x-1 hover:neon-glow-yellow group"
            >
              <Zap className="w-5 h-5 group-hover:text-[#FFD700] transition-colors duration-200" />
              <span className="font-mono font-medium">SIGNUP</span>
            </div>
          </nav>

          <div className="mt-auto relative z-10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-[#c0c0c0] hover:text-[#FF1801] hover:bg-gradient-to-r hover:from-[#333] hover:to-[#555] rounded-3xl cursor-pointer transition-all duration-300 ease-out hover:transform hover:translate-x-1 w-full group"
            >
              <LogOut className="w-5 h-5 group-hover:text-[#FF1801] transition-colors duration-200" />
              <span className="font-mono font-medium">PIT STOP</span>
            </button>
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-6xl font-mono font-thin text-transparent bg-gradient-to-r from-[#FF1801] via-[#FFD700] to-[#FF1801] bg-clip-text">
                CANTEEN
              </h1>
              <p className="text-[#c0c0c0] font-mono text-sm mt-1">MEAL CONSUMPTION ANALYTICS</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FFD700] w-4 h-4" />
                <input
                  placeholder="Search race data..."
                  className="pl-10 w-64 bg-gradient-to-r from-[#1a1a1a] to-[#333] border border-[#555] text-white placeholder-[#888] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF1801] focus:border-[#FF1801] transition-all duration-300 ease-out font-mono"
                />
              </div>
              <button
                onClick={fetchMealData}
                className="bg-gradient-to-r from-[#FF1801] to-[#FF4500] text-white hover:from-[#FF4500] hover:to-[#FFD700] px-6 py-2 rounded-full font-mono font-bold transition-all duration-300 ease-out hover:transform hover:scale-105 neon-glow flex items-center gap-2 uppercase tracking-wider"
              >
                <RefreshCw className="w-4 h-4" />
                PIT STOP
              </button>
              <button className="text-[#c0c0c0] hover:text-[#FFD700] p-2 transition-all duration-300 ease-out hover:transform hover:scale-110">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="bg-gradient-to-r from-[#1a1a1a] to-[#333] border border-[#FF1801] rounded-2xl p-6 inline-block neon-glow">
              <div className="text-sm text-[#FFD700] font-mono font-bold uppercase tracking-wider">TOTAL DRIVERS</div>
              <div className="text-3xl font-mono font-black text-white mt-1">{mealData.totalUsers}</div>
              <div className="text-xs text-[#c0c0c0] font-mono mt-1">REGISTERED PARTICIPANTS</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] border border-[#FFD700] text-white rounded-3xl p-6 transition-all duration-500 ease-out hover:transform hover:-translate-y-2 hover:neon-glow-yellow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#FFD700] to-transparent opacity-20 rounded-bl-full"></div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-lg font-mono font-bold text-[#FFD700] uppercase tracking-wider">DAY 1 BREAKFAST</h3>
                <span className="text-sm text-[#c0c0c0] hover:text-[#FFD700] cursor-pointer transition-all duration-200 ease-out font-mono">
                  MORE
                </span>
              </div>
              <div className="flex flex-col items-center relative z-10">
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

            <div className="bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] border border-[#c0c0c0] text-white rounded-3xl p-6 transition-all duration-500 ease-out hover:transform hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#c0c0c0] to-transparent opacity-20 rounded-bl-full"></div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-lg font-mono font-bold text-[#c0c0c0] uppercase tracking-wider">DAY 1 LUNCH</h3>
                <span className="text-sm text-[#888] hover:text-[#c0c0c0] cursor-pointer transition-all duration-200 ease-out font-mono">
                  MORE
                </span>
              </div>
              <div className="flex flex-col items-center relative z-10">
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

            <div className="bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] border border-[#FFD700] text-white rounded-3xl p-6 transition-all duration-500 ease-out hover:transform hover:-translate-y-2 hover:neon-glow-yellow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#FFD700] to-transparent opacity-20 rounded-bl-full"></div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-lg font-mono font-bold text-[#FFD700] uppercase tracking-wider">DAY 1 SNACKS</h3>
                <span className="text-sm text-[#c0c0c0] hover:text-[#FFD700] cursor-pointer transition-all duration-200 ease-out font-mono">
                  MORE
                </span>
              </div>
              <div className="flex flex-col items-center relative z-10">
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

            <div className="bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] border border-[#c0c0c0] text-white rounded-3xl p-6 transition-all duration-500 ease-out hover:transform hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#c0c0c0] to-transparent opacity-20 rounded-bl-full"></div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-lg font-mono font-bold text-[#c0c0c0] uppercase tracking-wider">DAY 1 DINNER</h3>
                <span className="text-sm text-[#888] hover:text-[#c0c0c0] cursor-pointer transition-all duration-200 ease-out font-mono">
                  MORE
                </span>
              </div>
              <div className="flex flex-col items-center relative z-10">
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

            <div className="bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] border border-[#FFD700] text-white rounded-3xl p-6 transition-all duration-500 ease-out hover:transform hover:-translate-y-2 hover:neon-glow-yellow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#FFD700] to-transparent opacity-20 rounded-bl-full"></div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-lg font-mono font-bold text-[#FFD700] uppercase tracking-wider">DAY 2 BREAKFAST</h3>
                <span className="text-sm text-[#c0c0c0] hover:text-[#FFD700] cursor-pointer transition-all duration-200 ease-out font-mono">
                  MORE
                </span>
              </div>
              <div className="flex flex-col items-center relative z-10">
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

            <div className="bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] border border-[#c0c0c0] text-white rounded-3xl p-6 transition-all duration-500 ease-out hover:transform hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#c0c0c0] to-transparent opacity-20 rounded-bl-full"></div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-lg font-mono font-bold text-[#c0c0c0] uppercase tracking-wider">DAY 2 LUNCH</h3>
                <span className="text-sm text-[#888] hover:text-[#c0c0c0] cursor-pointer transition-all duration-200 ease-out font-mono">
                  MORE
                </span>
              </div>
              <div className="flex flex-col items-center relative z-10">
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

          <div className="mt-8 bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] border border-[#FF1801] rounded-3xl p-6 transition-all duration-500 ease-out hover:neon-glow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FF1801] via-[#FFD700] to-[#FF1801] "></div>
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-8 h-8 text-[#FFD700]" />
              <h2 className="text-2xl font-mono font-black text-transparent bg-gradient-to-r from-[#FF1801] to-[#FFD700] bg-clip-text uppercase tracking-wider">
                RACE RESULTS
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#FF1801]">
                    <th className="text-left py-4 px-4 font-mono font-bold text-[#FFD700] uppercase tracking-wider">
                      POSITION
                    </th>
                    <th className="text-left py-4 px-4 font-mono font-bold text-[#FFD700] uppercase tracking-wider">
                      MEAL TYPE
                    </th>
                    <th className="text-right py-4 px-4 font-mono font-bold text-[#FFD700] uppercase tracking-wider">
                      CONSUMPTION
                    </th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  {[
                    { name: "Day 1 Breakfast", count: convertedMealData.day1.breakfast.eaten },
                    { name: "Day 1 Lunch", count: convertedMealData.day1.lunch.eaten },
                    { name: "Day 1 Snacks", count: convertedMealData.day1.snacks.eaten },
                    { name: "Day 1 Dinner", count: convertedMealData.day1.dinner.eaten },
                    { name: "Day 2 Breakfast", count: convertedMealData.day2.breakfast.eaten },
                    { name: "Day 2 Lunch", count: convertedMealData.day2.lunch.eaten },
                  ]
                    .sort((a, b) => b.count - a.count)
                    .map((meal, index) => (
                      <tr
                        key={meal.name}
                        className="border-b border-[#333] hover:bg-gradient-to-r hover:from-[#2a2a2a] hover:to-[#1a1a1a] transition-all duration-200 ease-out group"
                      >
                        <td className="py-4 px-4 font-mono font-bold">
                          <div className="flex items-center gap-2">
                            {index === 0 && (
                              <div className="w-6 h-6 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center text-black text-sm font-black">
                                1
                              </div>
                            )}
                            {index === 1 && (
                              <div className="w-6 h-6 bg-gradient-to-r from-[#c0c0c0] to-[#888] rounded-full flex items-center justify-center text-black text-sm font-black">
                                2
                              </div>
                            )}
                            {index === 2 && (
                              <div className="w-6 h-6 bg-gradient-to-r from-[#CD7F32] to-[#8B4513] rounded-full flex items-center justify-center text-white text-sm font-black">
                                3
                              </div>
                            )}
                            {index > 2 && (
                              <div className="w-6 h-6 bg-[#333] rounded-full flex items-center justify-center text-[#888] text-sm font-bold">
                                {index + 1}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 font-mono font-medium group-hover:text-[#FFD700] transition-colors duration-200">
                          {meal.name.toUpperCase()}
                        </td>
                        <td className="py-4 px-4 text-right font-mono font-bold text-[#FF1801] text-lg">
                          {meal.count}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
