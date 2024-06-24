import React, (useContext, useState) from 'react';
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
            navigate('/');
        } catch (error) {
            setError('Invalid username or password');
        }
    };

    return (
        <form onSubmit= { submit } >
        { error && <div>{ error } < /div> }
        < input
    value = { email }
    placeholder = 'email'
    onChange = { ev=> setEmail(ev.target.value)}
/>
    < input
value = { password }
placeholder = 'password'
type = 'password'
onChange = { ev => setPassword(ev.target.value) }
    />
    <button disabled={ !email || !password }> Login < /button>
        < /form>
      );
    };

export default LoginPage;


