import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import ManageMembers from "../components/member/ManageMembers";
import FixedDeposit from "../components/FixedDeposite/FixedDeposit"; 
import DepositList from "../components/FixedDeposite/DepositeList";
import Loan from '../components/Loan/Loan';
import LoanList  from "../components/Loan/LoanList";
import MemberDetail from "../components/member/MemberDetails";
import './DashboardAside.css';

const DashboardAside = () => {
  const [deposits, setDeposits] = useState([]);

  const handleAddDeposit = (newDeposit) => {
    setDeposits((prevDeposits) => [
      ...prevDeposits,
      { id: Date.now(), ...newDeposit },
    ]);
  };

  return (
    <div className="wrapper">
      <div className="sidebar">
        <h2>Dashboard</h2>
        <ul className="sidebar-menu">
          <li>
            <Link to="members">Manage Members</Link>
          </li>
          <li>
            <Link to="loans">Loans</Link>
          </li>
          <li>
            <Link to="loanlist">Loan List</Link>
          </li>
          <li>
            <Link to="fd">Fixed Deposits</Link>
          </li>
          <li>
            <Link to="deposite-list">Deposit List</Link>
          </li>
        </ul>
      </div>

      <div className="main-content">
        <Routes>
          <Route path="members" element={<ManageMembers />} />
          <Route path="/members/:id" component={MemberDetail} />
          <Route path="fd" element={<FixedDeposit onAddDeposit={handleAddDeposit} />} />
          <Route path="loans" element={<Loan />} />
          <Route path="loanlist" element={<LoanList />} />
          <Route path="deposite-list" element={<DepositList deposits={deposits} />} />
          <Route path="/" element={<div>Select an option from the sidebar</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default DashboardAside;
