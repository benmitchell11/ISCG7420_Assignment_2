// EditCourse.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch course data on component mount
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/courses/${courseId}/`);
        setCourse(response.data);
        setError('');
      } catch (error) {
        setError('Failed to fetch course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Update course data handler
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/courses/${courseId}/`, course);
      navigate(`/courses/${courseId}`);
    } catch (error) {
      setError('Failed to update course details');
    }
  };

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className="content">
      <h2>Edit Course</h2>
      <form onSubmit={handleUpdate}>
        <label>
          Course Name:
          <input
            type="text"
            name="name"
            value={course.name}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Course Code:
          <input
            type="text"
            name="code"
            value={course.code}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">Update Course</button>
      </form>
    </div>
  );
};

export default EditCourse;
