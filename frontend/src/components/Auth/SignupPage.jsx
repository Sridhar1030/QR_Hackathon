import { useState, useEffect } from "react"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const SignupPage = () => {
  const [teamName, setTeamName] = useState("")
  const [teams, setTeams] = useState([]) // ✅ array instead of object
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [email, setEmail] = useState("")

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const adminEmail = localStorage.getItem("email")
  const cleanedEmail = adminEmail?.replace(/"/g, "")

  // ✅ Fetch selected teams from backend
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/users/selected-teams`)
        setTeams(res.data) // assume backend returns [{ _id, name }, ...]
      } catch (err) {
        toast.error("Failed to fetch teams")
      }
    }
    fetchTeams()
  }, [backendUrl])

  const handleTeamSelect = async (e) => {
    const selectedTeamName = e.target.value
    setTeamName(selectedTeamName)

    try {
      const res = await axios.post(`${backendUrl}/api/users/getTeamDetailsByTeamName`, {
        teamName: selectedTeamName,
      })
      setSelectedTeam(res.data.members)
    } catch (err) {
      setSelectedTeam(null)
      toast.error("Failed to fetch team members")
    }
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

      // ✅ remove the signed-up team from dropdown
      setTeams((prev) => prev.filter((t) => t.name !== teamName))

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
              TEAM SIGNUP
              <br />
              <span className="text-4xl md:text-4xl bg-gradient-to-r from-yellow-400 to-white bg-clip-text text-transparent">
                RACE TO VICTORY
              </span>
            </h1>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl max-w-2xl mx-auto border-2 border-red-600 shadow-2xl shadow-red-600/20 relative overflow-hidden">
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
                      {teams.map((team) => (
                        <option key={team._id} value={team.name} className="bg-gray-800">
                          🏎️ {team.name}
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
      </main>
    </div>
  )
}

export default SignupPage
