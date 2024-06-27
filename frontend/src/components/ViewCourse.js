import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useParams, useNavigate, Link} from 'react-router-dom';

const ViewCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/courses/${courseId}/`);
        setCourse(response.data);
        setError('');
      } catch (error) {
        setError('Failed to fetch class details');
        setCourse({});
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/courses/${courseId}/`);
      navigate('/courses');
    } catch (error) {
      setError('Failed to delete course');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className="content">
      <h2>Course Details</h2>
      <p><strong>Name:</strong> {course.name}</p>
      <p><strong>Code:</strong> {course.code}</p>
      <Link to={`/courses/${courseId}/edit`}><button>Edit Course</button></Link>
      <button onClick={handleDelete}>Delete Course</button>
    </div>
  );
};

export default ViewCourse;
