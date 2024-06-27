import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useParams, useNavigate, Link} from 'react-router-dom';

const ViewSemester = () => {
  const { semesterId } = useParams();
  const navigate = useNavigate();
  const [semester, setSemester] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSemester = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/semesters/${semesterId}/`);
        setSemester(response.data);
        setError('');
      } catch (error) {
        setError('Failed to fetch class details');
        setSemester({});
      } finally {
        setLoading(false);
      }
    };

    fetchSemester();
  }, [semesterId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/semesters/${semesterId}/`);
      navigate('/semesters');
    } catch (error) {
      setError('Failed to delete semester');
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
      <h2>Semester Details</h2>
      <p><strong>Semester:</strong> {semester.semester}</p>
      <p><strong>Year:</strong> {semester.year}</p>
      <Link to={`/semesters/${semesterId}/edit`}><button>Edit Semester</button></Link>
      <button onClick={handleDelete}>Delete Semester</button>
    </div>
  );
};

export default ViewSemester;
