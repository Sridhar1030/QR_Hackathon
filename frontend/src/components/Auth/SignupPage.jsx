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

      const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const adminEmail = localStorage.getItem("email");
    const cleanedEmail = adminEmail.replace(/"/g, "");

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
    <div className="min-h-screen bg-gray-50">
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
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
            Team Planning, Making
            <br />
            Easy to Turn Dreams a Reality.
          </h1>
          <p className="text-xl text-gray-600 mb-8">Get Exclusive offers on selection of any teams</p>
          <div className="bg-white p-8 rounded-3xl max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Team Name
                  </label>
                  <div className="relative">
                    <svg
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <select
                      id="teamName"
                      value={teamName}
                      onChange={handleTeamSelect}
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-full text-base focus:outline-none focus:border-gray-400 focus:ring-0 appearance-none"
                      required
                    >
                      <option value="">Select a team</option>
                      {Object.keys(teams).map((team) => (
                        <option key={team} value={team}>
                          {team}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors whitespace-nowrap mt-7"
                >
                  Sign Up
                </button>
              </div>
            </form>

            {selectedTeam && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-3 text-left">Team Members:</h3>
                <ul className="list-disc pl-5 space-y-1 text-left">
                  {selectedTeam.map((member, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {member.name} - {member.email}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-black">Featured Teams</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
{/* Lunch Signup Card */}
<div className="bg-green-400 rounded-2xl p-6 text-black">
  <div className="text-sm font-medium mb-2">FOOD</div>
  <h3 className="text-xl font-bold mb-3">Lunch</h3>
  <p className="text-sm mb-6 opacity-80">
    Teams can register here for lunch. Please confirm your headcount to avoid wastage.
  </p>
  <div className="flex items-end justify-between">
    <div>
      <div className="text-xs opacity-70">Timing</div>
      <div className="text-2xl font-bold">1:00 PM</div>
    </div>
    <button className="bg-black bg-opacity-20 rounded-full p-2">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</div>

{/* Dinner Signup Card */}
<div className="bg-black rounded-2xl p-6 text-white">
  <div className="text-sm font-medium mb-2 opacity-70">FOOD</div>
  <h3 className="text-xl font-bold mb-3">Dinner</h3>
  <p className="text-sm mb-6 opacity-80">
    Teams can signup for dinner. Ensure your registration before evening slot closes.
  </p>
  <div className="flex items-end justify-between">
    <div>
      <div className="text-xs opacity-70">Timing</div>
      <div className="text-2xl font-bold">8:00 PM</div>
    </div>
    <button className="bg-white bg-opacity-20 rounded-full p-2">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</div>

{/* Snacks Signup Card */}
<div className="bg-purple-400 rounded-2xl p-6 text-black">
  <div className="text-sm font-medium mb-2">FOOD</div>
  <h3 className="text-xl font-bold mb-3">Snacks</h3>
  <p className="text-sm mb-6 opacity-80">
    Light snacks and refreshments signup. Great for quick energy during the hackathon!
  </p>
  <div className="flex items-end justify-between">
    <div>
      <div className="text-xs opacity-70">Available</div>
      <div className="text-2xl font-bold">4:30 PM</div>
    </div>
    <button className="bg-black bg-opacity-20 rounded-full p-2">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</div>

{/* Beverages Signup Card */}
<div className="bg-yellow-300 rounded-2xl p-6 text-black">
  <div className="text-sm font-medium mb-2">FOOD</div>
  <h3 className="text-xl font-bold mb-3">Beverages</h3>
  <p className="text-sm mb-6 opacity-80">
    Register here for tea, coffee, and soft drinks. Stay refreshed while coding!
  </p>
  <div className="flex items-end justify-between">
    <div>
      <div className="text-xs opacity-70">Available</div>
      <div className="text-2xl font-bold">All Day</div>
    </div>
    <button className="bg-black bg-opacity-20 rounded-full p-2">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
