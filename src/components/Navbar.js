// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';  // Optional: Create a separate CSS file for navbar styles

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="navbar-logo">Finance Tracker</Link>
            </div>
            <ul className="navbar-links">
                <li>
                    {/* <Link to="/dashboard">Dashboard</Link> */}
                </li>
                <li>
                    {/* <Link to="/members">Members</Link> */}
                </li>
                <li>
                    {/* <Link to="/payments">Payments</Link> */}
                </li>
                <li>
                    {/* <Link to="/fds">Fixed Deposits</Link> */}
                </li>
                <li>
                    <Link to="/login">Login</Link>
                </li>
                <li>
                    {/* <Link to="/register">Register</Link> */}
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
