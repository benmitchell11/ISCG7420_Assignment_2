import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
          {lecturers.map(lecturer => (
            <LecturerRow key={lecturer.user.id} lecturerData={lecturer} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const LecturerRow = ({ lecturerData }) => {
  const [courseName, setCourseName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/courses/${lecturerData.course}/`);
        setCourseName(response.data.name);
      } catch (error) {
        setError('Failed to fetch course');
      }
    };

    fetchCourse();
  }, [lecturerData.course]);

  return (
    <tr>
      <td>{lecturerData.user.id}</td>
      <td>{lecturerData.user.username}</td>
      <td>{lecturerData.dob}</td>
      <td>{courseName}</td>
      <td><Link to={`/lecturers/${lecturerData.user.id}`}>View Details</Link></td>
    </tr>
  );
};

export default LecturerList;
