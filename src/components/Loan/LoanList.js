import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LoanList = () => {
    const [loans, setLoans] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); // State to manage loading
    const [members, setMembers] = useState([]);
    const [amount, setAmount] = useState('');
    const [interest, setInterest] = useState('');
    const [duration, setDuration] = useState('');
    const [Loan, setLoan] = useState();
    const token = localStorage.getItem('token');

    const fetchLoans = async () => {
        setLoading(true); // Set loading to true before fetching
        try {
            console.log('Fetching loans...');
            const response = await axios.get('http://localhost:7000/api/loan/getAllLoan', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Response:', response.data); // Log the response data
            
            // Access loans using the correct key
            setLoans(response.data.Loan); // Update this line to access the 'Loan' key
            setError(''); // Clear any previous error
        } catch (error) {
            console.error('Failed to fetch loans:', error);
            if (error.response) {
                setError(`Failed to fetch loans: ${error.response.data.message || error.response.statusText}`);
            } else {
                setError('Failed to fetch loans. Please check your connection and try again.');
            }
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    useEffect(() => {
        fetchLoans(); // Fetch loans on component mount
        fetchMembers();
    }, []);
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

    const handleEdit = async (id) => {
        try {
            const response = await axios.get(`http://localhost:7000/api/loan/updateLoan/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            throw error;
        }
    }

    const getMemberNameById = (memID) => {
        const member = members.find((mem) => mem._id === memID);
        return member ? member.name :'unknown'; // Accessing member's name correctly
    };

    const handleLoanUpdate = (updatedLoan) => {
        setLoan(loans.map(loan => (loan._id === updatedLoan._id ? updatedLoan : loan)));
    };
    return (
        <div>
            <h1>Loan List</h1>
            {loading && <p>Loading loans...</p>} {/* Show loading message */}
            {error && <p>{error}</p>}
            {loans.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Member ID</th>
                            <th>Amount</th>
                            <th>Interest</th>
                            <th>Duration (months)</th>
                            <th>Start Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((loan) => (
                            <tr key={loan._id}>
                                <td>{getMemberNameById(loan.memberId)}</td>
                                <td>{loan.amount}</td>
                                <td>{loan.interest}</td>
                                <td>{loan.duration}</td>
                                <td>{new Date(loan.startDate).toLocaleDateString()}</td>
                                <td>
                                    <button className='btn btn-outline-primary m-2' onClick={()=>{handleLoanUpdate()}}>Edit</button>
                                    <button className='btn btn-outline-danger'>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                !loading && <p>No loans available.</p> // Show message only if not loading
            )}
            {/* <!-- Modal --> */}
<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      <form >
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Name:</label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Name:</label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={interest}
                                            onChange={(e) => setInterest(e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="phone" className="form-label">Phone:</label>
                                        <input
                                            type="text"
                                            id="phone"
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={handleEdit()}>Save changes</button>
      </div>
    </div>
  </div>
</div>

        </div>
    );
};

export default LoanList;
