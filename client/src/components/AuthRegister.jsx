import React, { useState } from 'react';


const Register = ((register)) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const submit = async (event) => {
        event.preventDefault();
        try {
            await register(email, password);
        } catch (error) {
            setError(error.message);
        }
    }
    return (
        <form onSubmit={submit}>
            {error}
            <input value={email} placeholder='email' onChange={event => setEmail(event.target.value)} />
            <input value={password} placeholder='password' onChange={event => setPassword(event.target.value)} />
            <button disabled={!email || !password} type='submit'>Register</button>
        </form>
    );
};

export default Register; 