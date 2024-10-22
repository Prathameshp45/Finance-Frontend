import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MemberDetail = () => {
  const { id } = useParams(); 
  const [memberDetails, setMemberDetails] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {``
    const fetchMemberDetails = async () => {
      try {
        console.log('Member ID:', id); 
        console.log('Authorization Token:', token); 

        const response = await axios.get(`http://localhost:7000/api/member/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Member Details Response:', response.data); 
        setMemberDetails(response.data);
      } catch (error) {
        if (error.response) {
          console.error('Error fetching member details:', error.response.data);
          console.error('Error status:', error.response.status);
        } else {
          console.error('Error fetching member details:', error.message);
        }
      }
    };

    if (id) {
      fetchMemberDetails();
    }
  }, [id, token]);

  if (!Object.keys(memberDetails).length) return <p>Loading...</p>;

  return (
    <div>
      <h2>Member Details</h2>
      <p>Name: {memberDetails.name}</p>
      <p>Phone: {memberDetails.phone}</p>
      <h3>Deposits</h3>
      
      <h3>Loans</h3>
      
    </div>
  );
};

export default MemberDetail;
