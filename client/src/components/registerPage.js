import React, { useState } from 'react';
import axios from 'axios';
import '../stylesheets/register.css';

function Register({ handleRegister, setButtonChosen }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '', // this will be used as email
        password: '',
        confirmPassword: ''
    });

    const handleGoBack = () => {
        setButtonChosen('');
    };

    const [errors, setErrors] = useState([]);

    const validateForm = () => {
        //setErrors([]);
        const { firstName, lastName, username, password, confirmPassword } = formData;
        const newErrors = [];

        // Simple email pattern check
        const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailPattern.test(username)) {
            newErrors.push('Please enter a valid email address.');
        }

        // Check password length
        if (password.length < 8) {
            newErrors.push('Password must be at least 8 characters long.');
        }

        // Check password for personal info
        if (password.includes(firstName) || password.includes(lastName) || password.includes(username.split('@')[0])) {
            newErrors.push('Password must not contain your first name, last name, or email id.');
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            newErrors.push('Passwords do not match.');
        }

        setErrors(newErrors);
        return newErrors.length === 0; // Return true if no errors
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                // check if a user with the same username already exists
                const existingUser = await axios.get(`http://localhost:8000/post/users/username/${formData.username}`);
                if (existingUser.data != null) {
                    setErrors(['A user with the same email already exists. Please use a different email.']);
                    return;
                }
                const response = await axios.post('http://localhost:8000/post/users/register', {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    username: formData.username, // email as username
                    password: formData.password
                });
                console.log('User created successfully!');
                setButtonChosen('login');
            } catch (error) {
                console.error('Registration failed:', error);
                //setErrors([...errors, 'Failed to register. Please try again.']);
                setErrors(['Failed to register. Please try again.']);

            }
        }
    };

    return (
        <div>
            <h2 className="register-heading">Register New User</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
                <input type="email" name="username" value={formData.username} onChange={handleChange} placeholder="Email" required />
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />
                <button type="submit" className="btn register-buttons">Sign Up</button>
                <button type="button" className="btn register-buttons" onClick={handleGoBack}>Back</button>
            </form>
            {errors.length > 0 && (
                <ul>
                    {errors.map((error, index) => (
                        <li key={index} style={{ color: 'red' }}>{error}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Register;

