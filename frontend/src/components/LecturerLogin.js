import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LecturerLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/lecturer-login/login/', {
                username: username,
                password: password
            });

            console.log('Login successful:', response.data);

            // Assuming response.data contains the lecturer ID or token for further identification
            const { token, lecturer_id } = response.data; // Adjust as per your API response structure

            // Store the lecturer ID or token in localStorage for future use
            localStorage.setItem('lecturerId', lecturer_id);
            localStorage.setItem('token', token);

            navigate('/LecturerMenu');
        } catch (error) {
            console.error('Login error:', error);
            setError('Invalid credentials or server error');
        }
    };

    return (
        <div>
            <h2>Lecturer Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Login</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default LecturerLogin;
