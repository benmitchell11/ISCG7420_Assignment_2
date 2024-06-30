import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminMenu = () => {
    const navigate = useNavigate();

  const handleSignOut = async () => {
      const token = localStorage.getItem('adminToken');
      console.log('Token being sent for logout:', token);
    try {
      await axios.post('http://localhost:8000/api/logout/logout/');
      console.log('Successfully signed out');
      navigate('/'); // Redirect to home page on successful logout
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
        <li><Link to="/courses">View Courses</Link></li>
        <li><Link to="/semesters">View Semesters</Link></li>
        <li><Link to="/lecturers">View Lecturers</Link></li>
        <li><Link to="/students">View Students</Link></li>
        <li><Link to="/classes">View Classes</Link></li>
        <li><Link to="/addstudentsfromexcel">Add Students from Excel</Link></li>
      </ul>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}

export default AdminMenu;
