import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LoanForm = () => {
    const [amount, setAmount] = useState('');
    const [interest, setInterest] = useState('');
    const [duration, setDuration] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get('http://localhost:7000/api/member/getAllMember', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setMembers(response.data);
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        };

        fetchMembers();
    }, [token]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSelectedMember(value);

        const filteredSuggestions = members.filter((member) =>
            member.name.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
    };

    const handleSuggestionClick = (member) => {
        setSelectedMember(member._id);
        setSuggestions([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedMember) {
            alert('Please select a valid member from the suggestions.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:7000/api/loan/createLoan', {
                memberId: selectedMember,
                amount,
                interest,
                duration,
                startDate
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Loan created successfully!');
            // Reset form fields after submission
            setAmount('');
            setInterest('');
            setDuration('');
            setStartDate(new Date().toISOString().split('T')[0]);
            setSelectedMember('');
            setSuggestions([]);
        } catch (error) {
            console.error('Error creating loan:', error);
            if (error.response) {
                alert(`Failed to create loan: ${error.response.data.message || error.response.statusText}`);
            } else {
                alert('Error creating loan. Please check your input and try again.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Member:</label>
                <input
                    type="text"
                    value={selectedMember ? members.find(m => m._id === selectedMember)?.name : ''}
                    onChange={handleInputChange}
                    placeholder="Search for a member"
                />
                {suggestions.length > 0 && (
                    <ul>
                        {suggestions.map((member) => (
                            <li key={member._id} onClick={() => handleSuggestionClick(member)}>
                                {member.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div>
                <label>Amount:</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div>
                <label>Interest Rate:</label>
                <input type="number" value={interest} onChange={(e) => setInterest(e.target.value)} required />
            </div>
            <div>
                <label>Duration (months):</label>
                <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required />
            </div>
            <div>
                <label>Start Date:</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            </div>
            <button type="submit">Create Loan</button>
        </form>
    );
};

export default LoanForm;
