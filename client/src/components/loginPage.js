import React, { useState } from 'react';
import axios from 'axios';
import '../stylesheets/login.css';

function Login({ handleLogin, setButtonChosen }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleGoBack = () => {
        setButtonChosen('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // clear previous errors

        try {
            const response = await axios.post('http://localhost:8000/post/users/login', {
                username: email,
                password: password
            });
            //console.log("this is the user data: ", response.data)
            // const sessionCheck = await axios.get('http://localhost:8000/check-session');
            // console.log("this is the session user: ", sessionCheck.data.user);
            handleLogin(response.data);
        } catch (error) {
            if (error.response) {
                // the request was made and the server responded with a status code
                // that falls out of the range of 2xx
                setError(error.response.data.message);
            } else {
                // something happened in setting up the request that triggered an Error
                setError('Login failed, please try again.');
            }
        }
    };

    return (
        <div>
            <h2 className="login-heading">Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleEmailChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handlePasswordChange} required />
                <button type="submit" className="btn login-buttons">Login</button>
                <button type="button" className="btn login-buttons" onClick={handleGoBack}>Back</button>
            </form>
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    );
}

export default Login;
