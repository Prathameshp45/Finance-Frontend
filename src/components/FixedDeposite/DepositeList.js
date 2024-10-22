import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DepositList = () => {
    const [fds, setFds] = useState([]);
    const [members, setMembers] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchFDs = async () => {
            try {
                const response = await axios.get('http://localhost:7000/api/FD/getAllFD', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Fetched FDs:", response.data); // Log the fetched data

                if (response.data.FD) {
                    setFds(response.data.FD); // Adjust this based on your actual data structure
                } else {
                    console.log("No FDs found in response.");
                }
            } catch (error) {
                console.error('Error fetching FDs:', error.response ? error.response.data : error);
            }
        };

        

        fetchFDs(); // Fetch FDs on component mount
        fetchMembers(); // Fetch members on component mount
    }, [token]);
    const fetchMembers = async () => {
        try {
            const response = await axios.get('http://localhost:7000/api/member/getAllMember', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Fetched members:", response.data); // Log the fetched members

            // Ensure response.data is an array
            if (Array.isArray(response.data)) {
                setMembers(response.data); // Assuming response.data is the member array
            } else {
                console.error("Fetched members is not an array:", response.data);
            }
        } catch (error) {
            console.error('Error fetching members:', error.response ? error.response.data : error);
        }
    };
    console.log('members', members);

    const getMemberNameById = (memID) => {
        const member = members.find((mem) => mem._id === memID);
        return member ? member.name :'unknown'; // Accessing member's name correctly
    };

    return (
        <div className="deposit-list">
            <h2>Fixed Deposits List</h2>
            {fds.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Member Name</th>
                            <th>Amount</th>
                            <th>Interest Rate</th>
                            <th>Duration (months)</th>
                            <th>Start Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fds.map((fd) => (
                            <tr key={fd._id}>
                                <td>{getMemberNameById(fd.memberId) || 'N/A'}</td>
                                <td>{fd.amount || 'N/A'}</td> {/* Amount */}
                                <td>{fd.interest || 'N/A'}</td> {/* Interest Rate */}
                                <td>{fd.duration || 'N/A'}</td> {/* Duration */}
                                <td>{new Date(fd.startDate).toLocaleDateString() || 'N/A'}</td> {/* Start Date */}
                                <td>
                                    <button className='btn btn-outline-primary m-2' >Edit</button>
                                    <button className='btn btn-outline-danger'>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No FDs available.</p>
            )}
        </div>
    );
};

export default DepositList;
