import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ManageFDs = () => {
    const [members, setMembers] = useState([]);
    const [fdData, setFdData] = useState({
        memberId: '',
        amount: '',
        interest: '',
        duration: '',
        startDate: '',
        memberName: ''
    });
    const [filteredMembers, setFilteredMembers] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get('http://localhost:7000/api/member/getAllMember', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Fetched members:", response.data.members); // Log the fetched members
                setMembers(response.data);
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        };

        fetchMembers();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFdData((prevData) => ({
            ...prevData,
            [name]: value
        }));

        // Filtering member suggestions based on input
        if (name === 'memberName') {
            const filtered = members.filter(member =>
                member.name && member.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredMembers(filtered);
        } else {
            setFilteredMembers([]);
        }
    };

    const handleSuggestionClick = (member) => {
        console.log("Selected member:", member); // Log the selected member for debugging
        setFdData((prevData) => ({
            ...prevData,
            memberId: member._id, // Make sure this is the correct field for the ID
            memberName: member.name
        }));
        setFilteredMembers([]); // Clear suggestions after selection
    };

    const addFD = async (e) => {
        e.preventDefault();
        console.log('FD Data being sent:', fdData); // Log the fdData

        // Check if memberId is set
        if (!fdData.memberId) {
            alert('Please select a member.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:7000/api/FD/createFD', {
                memberId: fdData.memberId,
                amount: fdData.amount,
                interest: fdData.interest,
                duration: fdData.duration,
                startDate: fdData.startDate
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert('FD created successfully!');
            
            // Reset the FD data
            setFdData({
                memberId: '',
                amount: '',
                interest: '',
                duration: '',
                startDate: '',
                memberName: ''
            });
            setFilteredMembers([]); // Clear suggestions
        } catch (error) {
            console.error('Error creating FD:', error.response ? error.response.data : error);
            alert(`An error occurred: ${error.response ? error.response.data.message : 'Unknown error'}`);
        }
    };

    return (
        <div className="manage-fds">
            <h2>Manage Fixed Deposits</h2>
            <form onSubmit={addFD}>
                <div>
                    <label htmlFor="memberName">Member Name:</label>
                    <input
                        type="text"
                        id="memberName"
                        name="memberName"
                        value={fdData.memberName}
                        onChange={handleChange}
                        required
                    />
                    {filteredMembers.length > 0 && (
                        <ul>
                            {filteredMembers.map((member) => (
                                <li key={member._id} onClick={() => handleSuggestionClick(member)}>
                                    {member.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div>
                    <label htmlFor="amount">Amount:</label>
                    <input
                        type="number"
                        id="amount"
                        value={fdData.amount}
                        onChange={(e) => setFdData({ ...fdData, amount: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="interest">Interest Rate:</label>
                    <input
                        type="number"
                        id="interest"
                        value={fdData.interest}
                        onChange={(e) => setFdData({ ...fdData, interest: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="duration">Duration (months):</label>
                    <input
                        type="number"
                        id="duration"
                        value={fdData.duration}
                        onChange={(e) => setFdData({ ...fdData, duration: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="startDate">Start Date:</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={fdData.startDate}
                        onChange={(e) => setFdData({ ...fdData, startDate: e.target.value })}
                        required
                    />
                </div>
                <button type="submit">Add FD</button>
            </form>
        </div>
    );
};

export default ManageFDs;
