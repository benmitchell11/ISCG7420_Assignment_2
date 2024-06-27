import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ViewLecturer = () => {
  const { lecturerId } = useParams();
  const navigate = useNavigate();
  const [lecturer, setLecturer] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchLecturer = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/lecturers/?user.id=${lecturerId}`);
      if (response.data.length > 0) {
        // Find the lecturer with the matching lecturerId
        const updatedLecturer = response.data.find(lecturer => lecturer.user.id.toString() === lecturerId);
        if (updatedLecturer) {
          setLecturer(updatedLecturer);
          setError('');
        } else {
          setError('Lecturer not found');
          setLecturer({});
        }
      } else {
        setError('Lecturer not found');
        setLecturer({});
      }
    } catch (error) {
      setError('Failed to fetch lecturer details');
      setLecturer({});
    } finally {
      setLoading(false);
    }
  };

  fetchLecturer();
}, [lecturerId]);




  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/lecturers/delete_by_user_id/?user.id=${lecturerId}`);
      navigate('/lecturers');
    } catch (error) {
      setError('Failed to delete lecturer.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h2>Lecturer Details</h2>
      <p><strong>ID:</strong> {lecturerId}</p>
      <p><strong>First Name:</strong> {lecturer.user && lecturer.user.first_name}</p>
      <p><strong>Last Name:</strong> {lecturer.user && lecturer.user.last_name}</p>
      <p><strong>Email:</strong> {lecturer.user && lecturer.user.email}</p>
      <p><strong>Date of Birth:</strong> {lecturer.dob}</p>
      <Link to={`/lecturers/${lecturerId}/edit`}><button>Edit Lecturer</button></Link>
      <button onClick={handleDelete}>Delete Lecturer</button>
    </div>
  );
};

export default ViewLecturer;
