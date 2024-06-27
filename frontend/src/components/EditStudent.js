import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditStudent = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState({
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
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/students/?user.id=${studentId}`);
        if (response.data.length > 0) {
          const fetchedStudent = response.data[0]; // Assuming API returns an array with one student object
          setStudent({
            user: {
              first_name: fetchedStudent.user.first_name,
              last_name: fetchedStudent.user.last_name,
              email: fetchedStudent.user.email
            },
            dob: fetchedStudent.dob
          });
          setError('');
        } else {
          setError('Student not found');
        }
      } catch (error) {
        setError('Failed to fetch student details');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  // Update student data handler
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/students/update_by_user_id/?user.id=${studentId}`, student);
      navigate(`/students/${studentId}`);
    } catch (error) {
      setError('Failed to update student details');
    }
  };

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent(prevStudent => ({
      ...prevStudent,
      user: {
        ...prevStudent.user,
        [name]: value
      }
    }));
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
            value={student.user.first_name}
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
            value={student.user.last_name}
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
            value={student.user.email}
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
            value={student.dob}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">Update Student</button>
      </form>
    </div>
  );
};

export default EditStudent;
