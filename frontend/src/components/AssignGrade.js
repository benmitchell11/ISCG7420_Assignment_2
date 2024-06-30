import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useParams} from "react-router-dom";

const AssignGrade = () => {
  const {  classId, studentId } = useParams();
  const [enrollment, setEnrollment] = useState(null);
  const [grade, setGrade] = useState('');
  const [gradeTime, setGradeTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch student enrollment details on component mount
  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/enrollments/get_by_student_id_and_class_id/?classID=${classId}&student_id=${studentId}`);
        setEnrollment(response.data);
      } catch (error) {
        setError('Failed to fetch enrollment details');
      }
    };

    fetchEnrollment();
  }, [studentId]);

  // Handle form submission to assign grade and grade time
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:8000/api/enrollments/${enrollment.id}/`, {
        grade,
        grade_time: Date.now(),
        student: studentId,
        classID: classId
      });

      setSuccess('Grade assigned successfully');
      setError('');
    } catch (error) {
      setError('Failed to assign grade');
      setSuccess('');
    }
  };

  if (!enrollment) {
    return <p>Loading...</p> ; // Handle loading state
  }

  return (
    <div>
      <h2>Assign Grade</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Student Name:</label>
          <p>{enrollment.student_name}</p>
        </div>
        <div>
          <label>New Grade:</label>
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
          />
        </div>
        <button type="submit">Assign Grade</button>
      </form>
    </div>
  );
};

export default AssignGrade;
