import { idleTimeoutMillis } from 'pg/lib/defaults';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const LoginPage = ({ login }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const submit = async (event) => {
        event.preventDefault();
        try {
            await login({ email, password });
            navigate('/'); // Assuming you want to navigate to the home page after a successful login
        } catch (error) {
            setError('Invalid username or password');
        }
    }

    return (

        // <div className="auth-container">
        <h1>'Login</h1>
        // <form onSubmit={handleSubmit}>   
        //     {error && <div>{error}</div>}         
        //     <label>Email</label>
        //     <input 
        //         type='email'
        //         name='email'
        //         id='email'
        //         value={credentials.email} 
        //         placeholder='Email' 
        //         onChange={handleChange}
        //         required
        //     />
        //     <label>Password</label
        //     <input 
        //         type='password'
        //         name='password'
        //         id='password'
        //         value={credentials.password} 
        //         placeholder='Password' 
        //         onChange={handleChange}
        //         required
        //     />
        //     <button disabled={!email || !password}>Login</button>
        // </form>
        // </div>
        </div >
    );
};

export default LoginPage;
