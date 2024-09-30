import React from 'react'

const Teampage = () => {

    const fetchTeamDetails = async () => {
        try {
            const response = await axios.post(
                `http://localhost:3000/api/users/getTeamDetailsByTeamName`,
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
