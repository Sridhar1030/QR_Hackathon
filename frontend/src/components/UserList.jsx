import { useState, useEffect } from "react"
import { Search, Settings, ChevronDown, User, ChevronLeft, ChevronRight } from "lucide-react"
import axios from "axios"

export default function UserProfiles() {
  const [users, setUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

      const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const adminEmail = localStorage.getItem("email");
    const cleanedEmail = adminEmail.replace(/"/g, "");

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
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Profiles</h1>
            <p className="text-gray-600">
              A list of all your users. You can search for and dive into their specific profiles.
            </p>
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search user or device IDs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex h-10 w-full rounded-full bg-slate-200 px-3 py-2 pl-10 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading users...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => fetchUsers(currentPage)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <>
            <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-3 gap-6 px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">USERNAME</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">EMAIL</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">TEAM NAME</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <div
                      key={`${user.username}-${index}`}
                      className="grid grid-cols-3 gap-6 px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{user.username || "N/A"}</div>
                      <div className="text-gray-600">{user.email || "N/A"}</div>
                      <div className="text-gray-900">{user.team || "N/A"}</div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? "No users found matching your search." : "No users available."}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {filteredUsers.length} of {users.length} users (Page {currentPage} of {totalPages})
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <span className="text-sm text-gray-700">
                    {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
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
