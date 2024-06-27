import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/classes/');
        setClasses(response.data);
      } catch (error) {
        setError('Failed to fetch classes');
      }
    };

    fetchClasses();
  }, []);

  return (
    <div className="content">
      <h2>Class List</h2>
      <Link to="/addclass"><button>Add a new class</button></Link>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Class Name</th>
            <th>Course</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr key={cls.id}>
              <td>{cls.id}</td>
              <td>{cls.name}</td>
              <td>{cls.course.name}</td>
              <td><Link to={`/classes/${cls.id}`}>View Class</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassList;
