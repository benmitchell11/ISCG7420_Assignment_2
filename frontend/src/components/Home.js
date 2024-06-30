import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {

    const handleSignOut = async () => {
        const token = localStorage.getItem('adminToken');
        console.log('Token being sent for logout:', token);

        try {
          const response = await axios.post('http://localhost:8000/api/logout/logout/', {}, {
            headers: {
              Authorization: `Token ${token}`
            }
          });

          console.log('Successfully signed out:', response.data);
          localStorage.removeItem('adminToken');
          window.location.href = '/';
        } catch (error) {
          console.error('Error signing out:', error);
        }
      };

  return (
    <div>
      <h1>Welcome to the Gradebook System</h1>
      <p>This is the home page of the Gradebook System.</p>
      <ul>
        <li><Link to="/adminlogin">Admin Login</Link></li>
        <li><Link to="/lecturerlogin">Lecturer Login</Link></li>
        <li><Link to="/studentlogin">Student Login</Link></li>
      </ul>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}

export default HomePage;
