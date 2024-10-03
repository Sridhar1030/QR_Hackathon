import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const adminEmail = localStorage.getItem("email");
    const cleanedEmail = adminEmail.replace(/"/g, "");

    const fetchUsers = async (page) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${backendUrl}/api/users/getAllUser?page=${page}&limit=15`, {
                adminEmail: cleanedEmail,
            });
            setUsers(response.data.users);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            setError('Failed to fetch users. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (isLoading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
            <h1 className="text-xl sm:text-2xl font-bold mb-4">User List</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Name</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map((user, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-xs sm:text-sm">{user.username}</td>
                                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-xs sm:text-sm">{user.email}</td>
                                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-xs sm:text-sm">{user.teamName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
                <div className="flex space-x-2 mb-2 sm:mb-0">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-2 sm:px-3 py-1 border rounded-md bg-gray-100 text-gray-600 disabled:opacity-50 text-xs sm:text-sm"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-2 sm:px-3 py-1 border rounded-md bg-gray-100 text-gray-600 disabled:opacity-50 text-xs sm:text-sm"
                    >
                        Next
                    </button>
                </div>
                <span className="text-xs sm:text-sm mt-2 sm:mt-0">
                    Page {currentPage} of {totalPages}
                </span>
            </div>
        </div>
    );
};

export default UserList;