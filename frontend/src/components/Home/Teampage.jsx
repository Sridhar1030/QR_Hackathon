import React from 'react'

const Teampage = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const fetchTeamDetails = async () => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/users/getTeamDetailsByTeamName`,
                {
                    teamName: userData?.teamName,
                }
            );
            setTeamMembers(response.data)
            console.log(response.data)
        } catch (error) {
            console.error("Error fetching team details", error);
        }
    }


    return (
        <div>

        </div>
    )
}

export default Teampage
