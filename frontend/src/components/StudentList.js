import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/students/');
        setStudents(response.data);
      } catch (error) {
        setError('Failed to fetch students');
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="content">
      <h2>Student List</h2>
      <Link to="/addstudent"><button>Add a new student</button></Link>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Date of Birth</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.user.id}>
              <td>{student.user.id}</td>
              <td>{student.user.username}</td>
              <td>{student.dob}</td>
              <td>
                <Link to={`/students/${student.user.id}`}>View Details</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
