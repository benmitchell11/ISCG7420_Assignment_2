import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useParams, useNavigate, Link} from 'react-router-dom';

const ViewStudent = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/students/?user.id=${studentId}`);
        if (response.data.length > 0) {
          setStudent(response.data[0]); // Assuming API returns an array, take the first element
          setError('');
        } else {
          setError('Student not found');
          setStudent({});
        }
      } catch (error) {
        setError('Failed to fetch student details');
        setStudent({});
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  const handleDelete = async () => {
  try {
    await axios.delete(`http://localhost:8000/api/students/delete_by_user_id/?user.id=${studentId}`);
    navigate('/students');
  } catch (error) {
    setError('Failed to delete student.');
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
      <h2>Student Details</h2>
      <p><strong>First Name:</strong> {student.user && student.user.first_name}</p>
      <p><strong>Last Name:</strong> {student.user && student.user.last_name}</p>
      <p><strong>Email:</strong> {student.user && student.user.email}</p>
      <p><strong>Date of Birth:</strong> {student.dob}</p>
      <Link to={`/students/${studentId}/edit`}><button>Edit Student</button></Link>
      <button onClick={handleDelete}>Delete Student</button>
    </div>
  );
};

export default ViewStudent;
