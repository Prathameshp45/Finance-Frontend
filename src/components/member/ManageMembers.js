import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ManageMembers = () => {
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchMembers();
    }, [token]);

    const fetchMembers = async () => {
        try {
            if (!token) {
                console.error('No token found, please login again.');
                return;
            }

            const response = await axios.get('http://localhost:7000/api/member/getAllMember', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Fetched Members:', response.data);
            setMembers(response.data);
            setFilteredMembers(response.data); // Set filtered members initially to show all members
        } catch (error) {
            console.error('Error fetching members:', error.response ? error.response.data : error.message);
        }
    };

    const addMember = async () => {
        try {
            if (!token) {
                console.error('No token found, please login again.');
                return;
            }

            const response = await axios.post(
                'http://localhost:7000/api/member/addMember',
                { name, phone },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('Member Added Response:', response.data);

            const newMember = response.data.member;
            setMembers((prevMembers) => [...prevMembers, newMember]);
            setFilteredMembers((prevMembers) => [...prevMembers, newMember]); // Add new member to filtered list as well

            setName('');
            setPhone('');
        } catch (error) {
            console.error('Error adding member:', error.response ? error.response.data : error.message);
        }
    };

    const handleAddMember = (e) => {
        e.preventDefault();
        addMember();
        fetchMembers();
    };

    // Handle search input 
    const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchTerm(searchValue);

        const filtered = members.filter((member) => {
            const memberName = member.name ? member.name.toLowerCase() : '';
            const memberPhone = member.phone ? String(member.phone).toLowerCase() : '';

            return memberName.includes(searchValue) || memberPhone.includes(searchValue);
        });

        setFilteredMembers(filtered);
    };


    return (
        <div className="manage-members">
            <h2>Manage Members</h2>

            {/* Search bar */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search members by name or phone..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="form-control"
                />
            </div>

            <div className="add-member mt-4">
                <h3>Add Member</h3>
                <button className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                    Add Member
                </button>
            </div>

            <div className="member-list mt-4">
                <h3>Member List</h3>
                {filteredMembers.length > 0 ? (
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Number</th>
                            </tr>
                        </thead>
                        <tbody>
  {filteredMembers.map((member) => (
    <tr key={member._id}>
      <td>
        <Link to={`/members/${member._id}`}>{member?.name}</Link> {/* Correct ID usage */}
      </td>
      <td>{member?.phone}</td>
    </tr>
  ))}
</tbody>

                    </table>
                ) : (
                    <p>No members found.</p>
                )}
            </div>

            {/* Modal for adding a member */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Add Member</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleAddMember}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name:</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Phone:</label>
                                    <input
                                        type="text"
                                        id="phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="form-control"
                                        required
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">
                                Close
                            </button>
                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={handleAddMember}>
                                Save changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageMembers;
