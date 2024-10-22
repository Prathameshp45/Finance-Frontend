import './styles.css'; 
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import DashboardAside from './pages/DashboardAside';
import MemberDetail from './components/member/MemberDetails'; 
import ManageMembers from './components/member/ManageMembers';


const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    {/* <Route path="/" element={<Dashboard />} /> */}
                    <Route path="/*" element={<DashboardAside />}></Route>
                    <Route path="/members" element={<ManageMembers />} />
            <Route path="/members/:id" element={<MemberDetail />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    {/* You can add more routes for Members, Payments, etc. */}
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
