import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LecturerClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/classes/lecturer-classes/', {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}` // Adjust this based on how you store the token
          }
        });
        setClasses(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch classes');
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h2>Lecturer Classes</h2>
      <ul>
        {classes.map((classItem) => (
          <li key={classItem.id}>{classItem.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default LecturerClasses;
