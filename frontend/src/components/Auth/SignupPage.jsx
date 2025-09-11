import { useState, useEffect } from "react"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import participantsGroupedData from "./FinalTeam.json"

const SignupPage = () => {
  const [teamName, setTeamName] = useState("")
  const [teams, setTeams] = useState({})
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [email, setEmail] = useState("")

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const adminEmail = localStorage.getItem("email")
  const cleanedEmail = adminEmail?.replace(/"/g, "")

  useEffect(() => {
    setTeams(participantsGroupedData)
  }, [])

  const handleTeamSelect = (e) => {
    const selectedTeamName = e.target.value
    setTeamName(selectedTeamName)
    setSelectedTeam(teams[selectedTeamName])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(`${backendUrl}/api/users/signup`, {
        teamName: teamName.trim(),
        adminEmail: cleanedEmail,
        email: email.trim(),
      })

      toast.success(response.data.message || "Team signed up successfully!")

      const updatedTeams = { ...teams }
      delete updatedTeams[teamName]
      setTeams(updatedTeams)

      setTeamName("")
      setSelectedTeam(null)
      setEmail("")
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-1"></div>
        <div className="absolute top-16 left-0 w-full h-32 bg-gradient-to-r from-transparent via-gray-400 to-transparent transform skew-y-1"></div>
      </div>

      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: "20px 20px",
        }}
      ></div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="font-mono"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="text-center mb-16">
          <div className="relative mb-8">
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-yellow-400 leading-tight font-mono tracking-wider transform hover:scale-105 transition-transform duration-300">
              TEAM PLANNING
              <br />
              <span className="text-4xl md:text-4xl bg-gradient-to-r from-yellow-400 to-white bg-clip-text text-transparent">
                RACE TO VICTORY
              </span>
            </h1>
          </div>

          <p className="text-xl text-gray-300 mb-8 font-mono tracking-wide">
            🏁 GET EXCLUSIVE OFFERS ON SELECTION OF ANY TEAMS 🏁
          </p>

          <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl max-w-2xl mx-auto border-2 border-red-600 shadow-2xl shadow-red-600/20 relative overflow-hidden">
            {/* Racing panel lights */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse delay-150"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="teamName"
                    className="block text-sm font-bold text-yellow-400 mb-2 text-left font-mono tracking-wider"
                  >
                    🏎️ SELECT YOUR RACING TEAM
                  </label>
                  <div className="relative">
                    <svg
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                    </svg>
                    <select
                      id="teamName"
                      value={teamName}
                      onChange={handleTeamSelect}
                      className="w-full pl-14 pr-4 py-4 bg-gray-800 border-2 border-gray-600 rounded-full text-white font-mono focus:outline-none focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/20 appearance-none transition-all duration-300 hover:border-red-500"
                      required
                    >
                      <option value="" className="bg-gray-800">
                        🏁 Select a racing team
                      </option>
                      {Object.keys(teams).map((team) => (
                        <option key={team} value={team} className="bg-gray-800">
                          🏎️ {team}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-400 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-4 rounded-full font-black font-mono tracking-wider hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 whitespace-nowrap mt-7 transform hover:scale-110 hover:shadow-lg hover:shadow-yellow-400/50 border-2 border-yellow-600"
                >
                  🚀 IGNITION
                </button>
              </div>
            </form>

            {selectedTeam && (
              <div className="mt-6 pt-6 border-t-2 border-red-600">
                <h3 className="text-lg font-bold text-red-400 mb-3 text-left font-mono tracking-wider">
                  🏁 RACING CREW MEMBERS:
                </h3>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-600">
                  <ul className="space-y-2 text-left">
                    {selectedTeam.map((member, index) => (
                      <li key={index} className="text-sm text-gray-300 font-mono flex items-center">
                        <span className="text-yellow-400 mr-2">🏎️</span>
                        <span className="text-white font-semibold">{member.name}</span>
                        <span className="text-gray-400 ml-2">- {member.email}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-400 font-mono tracking-wider">
              🏁 PIT STOP SERVICES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Lunch Racing Panel */}
            <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-2xl p-6 text-black transform hover:scale-105 hover:rotate-1 transition-all duration-300 hover:shadow-2xl hover:shadow-green-400/50 border-2 border-green-600 relative overflow-hidden group">
              <div className="absolute top-2 right-2">
                <div className="w-4 h-4 bg-black rounded-full"></div>
              </div>
              <div className="text-sm font-black mb-2 font-mono tracking-wider">🍽️ FUEL STATION</div>
              <h3 className="text-2xl font-black mb-3 font-mono">LUNCH</h3>
              <p className="text-sm mb-6 opacity-90 font-mono">
                Refuel your racing team here. Confirm headcount to avoid pit stop delays.
              </p>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs opacity-70 font-mono">PIT TIME</div>
                  <div className="text-3xl font-black font-mono bg-black text-green-400 px-2 py-1 rounded">1:00</div>
                </div>
                <button className="bg-black bg-opacity-30 rounded-full p-3 hover:bg-opacity-50 transition-all ">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Dinner Racing Panel */}
            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 text-white transform hover:scale-105 hover:rotate-1 transition-all duration-300 hover:shadow-2xl hover:shadow-red-600/50 border-2 border-red-800 relative overflow-hidden group">
              <div className="absolute top-2 right-2">
                <div className="w-4 h-4 bg-yellow-400 rounded-full "></div>
              </div>
              <div className="text-sm font-black mb-2 opacity-90 font-mono tracking-wider">🏎️ NIGHT FUEL</div>
              <h3 className="text-2xl font-black mb-3 font-mono">DINNER</h3>
              <p className="text-sm mb-6 opacity-90 font-mono">
                Evening refuel station. Register before the checkered flag drops!
              </p>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs opacity-70 font-mono">PIT TIME</div>
                  <div className="text-3xl font-black font-mono bg-yellow-400 text-black px-2 py-1 rounded">8:00</div>
                </div>
                <button className="bg-yellow-400 bg-opacity-30 rounded-full p-3 hover:bg-opacity-50 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Snacks Racing Panel */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white transform hover:scale-105 hover:rotate-1 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50 border-2 border-purple-700 relative overflow-hidden group">
              <div className="absolute top-2 right-2">
                <div className="w-4 h-4 bg-green-400 rounded-full "></div>
              </div>
              <div className="text-sm font-black mb-2 font-mono tracking-wider">⚡ BOOST STATION</div>
              <h3 className="text-2xl font-black mb-3 font-mono">SNACKS</h3>
              <p className="text-sm mb-6 opacity-90 font-mono">Quick energy boost for maximum racing performance!</p>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs opacity-70 font-mono">BOOST TIME</div>
                  <div className="text-3xl font-black font-mono bg-yellow-400 text-black px-2 py-1 rounded">4:30</div>
                </div>
                <button className="bg-yellow-400 bg-opacity-30 rounded-full p-3 hover:bg-opacity-50 transition-all ">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Beverages Racing Panel */}
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-6 text-black transform hover:scale-105 hover:rotate-1 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/50 border-2 border-yellow-600 relative overflow-hidden group">
              <div className="absolute top-2 right-2">
                <div className="w-4 h-4 bg-red-600 rounded-full "></div>
              </div>
              <div className="text-sm font-black mb-2 font-mono tracking-wider">🥤 HYDRO STATION</div>
              <h3 className="text-2xl font-black mb-3 font-mono">BEVERAGES</h3>
              <p className="text-sm mb-6 opacity-90 font-mono">
                Stay hydrated during the race! Premium racing fuel for champions.
              </p>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs opacity-70 font-mono">AVAILABLE</div>
                  <div className="text-2xl font-black font-mono bg-black text-yellow-400 px-2 py-1 rounded">24/7</div>
                </div>
                <button className="bg-black bg-opacity-30 rounded-full p-3 hover:bg-opacity-50 transition-all ">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SignupPage
