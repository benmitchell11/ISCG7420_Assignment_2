import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";

const LecturerList = () => {
  const [lecturers, setLecturers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/lecturers/');
        setLecturers(response.data);
      } catch (error) {
        setError('Failed to fetch lecturers');
      }
      console.log(lecturers)
    };

    fetchLecturers();
  }, []);

  return (
    <div className="content">
      <h2>Lecturer List</h2>
      <Link to="/addlecturer"><button>Add a new lecturer</button></Link>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Date of Birth</th>
            <th>Course</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {lecturers.map((lecturer) => (
              console.log(lecturer),
            <tr key={lecturer.user.id}>
              <td>{lecturer.user.id}</td>
              <td>{lecturer.user.username}</td>
              <td>{lecturer.dob}</td>
              <td>{lecturer.course.name}</td>
              <td><Link to={`/lecturers/${lecturer.user.id}`}>View Details</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LecturerList;
