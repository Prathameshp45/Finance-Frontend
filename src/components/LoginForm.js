import React, { useContext, useState } from 'react';
import axios from '../services/axiosConfig'; 
import { AuthContext } from '../context/AuthContext';
import './LoginForm.css'; 
import { useNavigate } from 'react-router-dom'; 


const LoginForm = () => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth/login', { 
                email: username,
                password: password
            });

            const { token } = response.data;

            // Save 
            localStorage.setItem('token', token);
           
            login(token);
            alert("login successful")
            navigate('/dashboard'); 
        } catch (err) {
            console.error('Login error:', err.response); 
            setError(err.response ? err.response.data.message : 'Login failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <input 
                type="text" 
                placeholder="Email" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;
