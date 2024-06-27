import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddLecturer = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [courseId, setCourseId] = useState('');
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/courses/');
        setCourses(response.data);
      } catch (error) {
        setError('Failed to fetch courses');
      }
    };

    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:8000/api/lecturers/', {
        user: {
          first_name: firstName,
          last_name: lastName,
          email,
          username: email,
          password: "Lecturer123",
        },
        dob,
        course: courseId,
      });

      setFirstName('');
      setLastName('');
      setEmail('');
      setDob('');
      setCourseId('');
      setSuccess('Lecturer added successfully');
      setError('');
    } catch (error) {
      setError('Failed to add lecturer');
      setSuccess('');
    }
  };

  return (
    <div>
      <h2>Add Lecturer</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Course:</label>
          <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
            ))}
          </select>
        </div>
        <button type="submit">Add Lecturer</button>
      </form>
    </div>
  );
};

export default AddLecturer;
