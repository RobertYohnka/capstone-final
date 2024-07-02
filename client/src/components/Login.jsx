import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../styles/Login.css';

const Login = ({ login }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    //hangle change
    const handleChange = (event) => {
        setEmail({ ...email, [event.target.email]: event.target.value });
    };

    //handle submit
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Invalid credentials');
            }
            const data = await response.json();
            const token = data.token;
            console.log(token); // token is being returned
            setToken(token);
            navigate('/');
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        }
    };

    return (
        <div className="auth-container">
            <h1>Login</h1>
            {error && <p>Error: {error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={handleChange}
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit">Login</button>
            </form>
            <p>
                Do you work at the University? <a href="/register">Register here for access.</a>
            </p>
        </div>
    );
};

export default Login;

