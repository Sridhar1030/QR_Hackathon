import React from "react";

const TeamDetailsPopup = ({ isOpen, onClose, teamDetails }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Team Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    {teamDetails.map((member) => (
                        <div
                            key={member._id}
                            className="bg-gray-100 rounded-lg p-4 shadow-md"
                        >
                            <div className="flex items-center mb-3">
                                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                                    {member.username.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        {member.username}
                                    </h3>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm">
                                    <span className="font-semibold">
                                        Email:
                                    </span>{" "}
                                    {member.email}
                                </p>
                                <p className="text-sm">
                                    <span className="font-semibold">
                                        Phone:
                                    </span>{" "}
                                    {member.phoneNumber}
                                </p>
                                <p className="text-sm">
                                    <span className="font-semibold">
                                        College:
                                    </span>{" "}
                                    {member.college}
                                </p>
                                <a
                                    href={member.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-500 hover:text-blue-700"
                                >
                                    GitHub Profile
                                </a>
                                <div className="mt-3">
                                    <p className="text-sm font-semibold mb-1">
                                        Meal Status:
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(member.meals).map(
                                            ([meal, status]) => (
                                                <span
                                                    key={meal}
                                                    className={`text-xs px-2 py-1 rounded ${
                                                        status
                                                            ? "bg-green-200 text-green-800"
                                                            : "bg-red-200 text-red-800"
                                                    }`}
                                                >
                                                    {meal}:{" "}
                                                    {status
                                                        ? "Taken"
                                                        : "Not Taken"}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeamDetailsPopup;
