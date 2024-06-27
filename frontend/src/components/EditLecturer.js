import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditLecturer = () => {
  const { lecturerId } = useParams();
  const navigate = useNavigate();
  const [lecturer, setLecturer] = useState({
    user: {
      first_name: '',
      last_name: '',
      email: ''
    },
    dob: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch student data on component mount
  useEffect(() => {
    const fetchLecturer = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/lecturers/?user.id=${lecturerId}`);
        if (response.data.length > 0) {
          const fetchedLecturer = response.data[0]; // Assuming API returns an array with one student object
          setLecturer({
            user: {
              first_name: fetchedLecturer.user.first_name,
              last_name: fetchedLecturer.user.last_name,
              email: fetchedLecturer.user.email
            },
            dob: fetchedLecturer.dob
          });
          setError('');
        } else {
          setError('Lecturer not found');
        }
      } catch (error) {
        setError('Failed to fetch lecturer details');
      } finally {
        setLoading(false);
      }
    };

    fetchLecturer();
  }, [lecturerId]);

  // Update student data handler
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/lecturers/update_by_user_id/?user.id=${lecturerId}`, lecturer);
      navigate(`/lecturers/${lecturerId}`);
    } catch (error) {
      setError('Failed to update lecturers details');
    }
    console.log(lecturer)

  };

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLecturer(prevLecturer => ({
      ...prevLecturer,

      user: {
        ...prevLecturer.user,
        [name]: value
      }

    }));
    console.log(lecturer)
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h2>Edit Student</h2>
      <form onSubmit={handleUpdate}>
        <label>
          First Name:
          <input
            type="text"
            name="first_name"
            value={lecturer.user.first_name}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Last Name:
          <input
            type="text"
            name="last_name"
            value={lecturer.user.last_name}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={lecturer.user.email}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Date of Birth:
          <input
            type="date"
            name="dob"
            value={lecturer.dob}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">Update Lecturer</button>
      </form>
    </div>
  );
};

export default EditLecturer;
