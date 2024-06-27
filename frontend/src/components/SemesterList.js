import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/styles.css';

const SemesterList = () => {
  const [semesters, setSemesters] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/semesters/');
        setSemesters(response.data);
      } catch (error) {
        setError('Failed to fetch semesters');
      }
    };

    fetchSemesters();
  }, []);

  return (
    <div className="content">
      <h2>Semester List</h2>
      <Link to="/addsemester"><button>Add a new semester</button></Link>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Semester</th>
            <th>Year</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {semesters.map((semester) => (
            <tr key={semester.id}>
              <td>{semester.semester}</td>
              <td>{semester.year}</td>
              <td><a href={`/semesters/${semester.id}`}>View</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SemesterList;
