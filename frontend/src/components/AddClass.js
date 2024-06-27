import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddClass = () => {
  const [number, setNumber] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [name, setName] = useState('');
  const [semesters, setSemesters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/semesters/');
        setSemesters(response.data);
      } catch (error) {
        setError('Failed to fetch semesters');
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/courses/');
        setCourses(response.data);
      } catch (error) {
        setError('Failed to fetch courses');
      }
    };

    fetchSemesters();
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:8000/api/classes/', {
        number,
        semester: semesterId,
        course: courseId,
        name,
      });

      setNumber('');
      setSemesterId('');
      setCourseId('');
      setName('');
      setSuccess('Class added successfully');
      setError('');
    } catch (error) {
      setError('Failed to add class');
      setSuccess('');
    }
  };

  return (
    <div>
      <h2>Add Class</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Number:</label>
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Semester:</label>
          <select
            value={semesterId}
            onChange={(e) => setSemesterId(e.target.value)}
            required
          >
            <option value="">Select a semester</option>
            {semesters.map((semester) => (
              <option key={semester.id} value={semester.id}>
                {semester.semester} {semester.year}
              </option>
            ))}
          </select>
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
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Class</button>
      </form>
    </div>
  );
};

export default AddClass;
