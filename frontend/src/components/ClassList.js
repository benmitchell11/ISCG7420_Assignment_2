import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
          {classes.map(cls => (
            <ClassRow key={cls.id} classData={cls} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ClassRow = ({ classData }) => {
  const [courseName, setCourseName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/courses/${classData.course}/`);
        setCourseName(response.data.name);
      } catch (error) {
        setError('Failed to fetch course');
      }
    };

    fetchCourse();
  }, [classData.course]);

  return (
    <tr>
      <td>{classData.id}</td>
      <td>{classData.name}</td>
      <td>{courseName}</td>
      <td><Link to={`/classes/${classData.id}`}>View Class</Link></td>
    </tr>
  );
};

export default ClassList;
