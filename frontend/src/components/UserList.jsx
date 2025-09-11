import { useState, useEffect } from "react"
import { Search, User, ChevronLeft, ChevronRight, Flag, Trophy } from "lucide-react"
import axios from "axios"

export default function UserProfiles() {
  const [users, setUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const adminEmail = localStorage.getItem("email")
  const cleanedEmail = adminEmail.replace(/"/g, "")

  const fetchUsers = async (page) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.post(`${backendUrl}/api/users/getAllUser?page=${page}&limit=30`, {
        adminEmail: cleanedEmail,
      })
      setUsers(response.data.users || [])
      setCurrentPage(response.data.currentPage || 1)
      setTotalPages(response.data.totalPages || 1)
    } catch (err) {
      setError("Failed to fetch users. Please try again.")
      console.error("Error fetching users:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (backendUrl && cleanedEmail) {
      fetchUsers(currentPage)
    }
  }, [currentPage, backendUrl, cleanedEmail])

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.team?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4 md:p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
        <div className="absolute top-1/4 right-0 w-2 h-32 bg-gradient-to-b from-white via-black to-white opacity-20"></div>
        <div className="absolute bottom-1/4 left-0 w-2 h-32 bg-gradient-to-b from-white via-black to-white opacity-20"></div>
      </div>

      <div className="mx-auto max-w-6xl relative z-10">
        <div className="mb-8">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Flag className="h-8 w-8 text-red-500" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 via-white to-red-500 bg-clip-text text-transparent uppercase tracking-wider font-mono">
                DRIVER LEADERBOARD
              </h1>
              <Trophy className="h-8 w-8 text-yellow-400" />
            </div>
            <p className="text-gray-300 font-mono text-sm uppercase tracking-wide">
              RACE STANDINGS • DRIVER PROFILES • TEAM STATISTICS
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-400 h-5 w-5" />
              <input
                type="text"
                placeholder="SEARCH DRIVERS • TEAMS • EMAILS"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex h-12 w-full rounded-none bg-black/80 border-2 border-red-500/50 px-4 py-3 pl-12 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all duration-300 font-mono uppercase tracking-wider"
              />
              <div className="absolute inset-0 rounded-none border border-red-500/20 pointer-events-none"></div>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
            <p className="mt-4 text-red-400 font-mono uppercase tracking-wider">LOADING RACE DATA...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12 bg-red-900/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 font-mono uppercase tracking-wider">{error}</p>
            <button
              onClick={() => fetchUsers(currentPage)}
              className="mt-4 px-6 py-3 bg-red-600 text-white rounded-none hover:bg-red-700 transition-colors font-mono uppercase tracking-wider border-2 border-red-500"
            >
              RETRY CONNECTION
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <>
            <div className="bg-black/90 border-2 border-red-500/50 rounded-none overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.3)]">
              <div className="grid grid-cols-3 gap-6 px-8 py-6 bg-gradient-to-r from-red-900/50 to-black/80 border-b-2 border-red-500/50">
                <div className="text-xs font-bold text-red-400 uppercase tracking-[0.2em] font-mono flex items-center gap-2">
                  <User className="h-4 w-4" />
                  DRIVER NAME
                </div>
                <div className="text-xs font-bold text-red-400 uppercase tracking-[0.2em] font-mono">
                  CONTACT FREQUENCY
                </div>
                <div className="text-xs font-bold text-red-400 uppercase tracking-[0.2em] font-mono flex items-center gap-2">
                  <Flag className="h-4 w-4" />
                  RACING TEAM
                </div>
              </div>

              <div className="divide-y divide-red-500/20">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <div
                      key={`${user.username}-${index}`}
                      className="grid grid-cols-3 gap-6 px-8 py-6 hover:bg-red-900/20 hover:shadow-[inset_0_0_20px_rgba(239,68,68,0.2)] transition-all duration-300 group border-l-4 border-l-transparent hover:border-l-red-500 relative overflow-hidden"
                      style={{
                        background:
                          index % 2 === 0
                            ? "linear-gradient(90deg, rgba(17,24,39,0.8) 0%, rgba(0,0,0,0.9) 100%)"
                            : "linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(17,24,39,0.8) 100%)",
                      }}
                    >
                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500/30 font-bold text-lg font-mono">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="font-bold text-white font-mono uppercase tracking-wider text-lg group-hover:text-red-400 transition-colors pl-8">
                        {user.username || "UNKNOWN DRIVER"}
                      </div>
                      <div className="text-gray-300 font-mono text-sm tracking-wide">{user.email || "NO SIGNAL"}</div>
                      <div className="text-white font-mono uppercase tracking-wider flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        {user.team || "INDEPENDENT"}
                      </div>

                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  ))
                ) : (
                  <div className="px-8 py-12 text-center text-gray-400 font-mono uppercase tracking-wider">
                    {searchTerm ? "NO DRIVERS MATCH SEARCH CRITERIA" : "NO DRIVERS REGISTERED"}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between bg-black/50 p-4 border border-red-500/30 rounded-none">
              <div className="text-sm text-gray-300 font-mono uppercase tracking-wide">
                SHOWING {filteredUsers.length} OF {users.length} DRIVERS • LAP {currentPage} OF {totalPages}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-500 px-4 py-2 text-sm font-bold text-white transition-colors font-mono uppercase tracking-wider border-2 border-red-500 disabled:border-gray-600"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    PREV LAP
                  </button>

                  <span className="text-sm text-red-400 font-mono font-bold px-4 py-2 bg-black/80 border border-red-500/50">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-500 px-4 py-2 text-sm font-bold text-white transition-colors font-mono uppercase tracking-wider border-2 border-red-500 disabled:border-gray-600"
                  >
                    NEXT LAP
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
