import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/courses/');
        setCourses(response.data);
      } catch (error) {
        setError('Failed to fetch courses');
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="content">
      <h2>Course List</h2>
      <Link to="/addcourse"><button>Add a new course</button></Link>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Code</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course.id}>
              <td>{course.id}</td>
              <td>{course.name}</td>
              <td>{course.code}</td>
              <td><Link to={`/courses/${course.id}`}>View Course</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseList;
