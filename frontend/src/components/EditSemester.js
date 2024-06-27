// EditSemester.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditSemester = () => {
  const { semesterId } = useParams();
  const navigate = useNavigate();
  const [semester, setSemester] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch semester data on component mount
  useEffect(() => {
    const fetchSemester = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/semesters/${semesterId}/`);
        setSemester(response.data);
        setError('');
      } catch (error) {
        setError('Failed to fetch semester details');
      } finally {
        setLoading(false);
      }
    };

    fetchSemester();
  }, [semesterId]);

  // Update semester data handler
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8000/api/semesters/${semesterId}/`, semester);
      navigate(`/semesters/${semesterId}`);
    } catch (error) {
      setError('Failed to update semester details');
    }
  };

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSemester({ ...semester, [name]: value });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h2>Edit Semester</h2>
      <form onSubmit={handleUpdate}>
        <label>
          Semester Number:
          <input
            type="number"
            name="semester"
            value={semester.semester}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Year:
          <input
            type="number"
            name="year"
            value={semester.year}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">Update Semester</button>
      </form>
    </div>
  );
};

export default EditSemester;
