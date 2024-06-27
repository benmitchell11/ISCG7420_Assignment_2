import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditClass = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState({});
  const [semesterId, setSemesterId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);



  // Fetch semesters and courses on component mount
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

    const fetchClassData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/classes/${classId}/`);
        setClassData(response.data);
        setSemesterId(response.data.semester); // Set semesterId initially based on classData
        setCourseId(response.data.course); // Set courseId initially based on classData
        setError('');
      } catch (error) {
        setError('Failed to fetch class details');
      } finally {
        setLoading(false);
      }
    };

    fetchSemesters();
    fetchCourses();
    fetchClassData();
  }, [classId]);

  // Update class data handler
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedClass = {
        ...classData,
        semester: semesterId,
        course: courseId,
      };
      await axios.put(`http://localhost:8000/api/classes/${classId}/`, updatedClass);
      navigate(`/classes/${classId}`);
    } catch (error) {
      setError('Failed to update class details');
    }
  };

  // Input change handler for classData fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassData({ ...classData, [name]: value });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h2>Edit Class</h2>
      <form onSubmit={handleUpdate}>
        <label>
          Class Number:
          <input
            type="number"
            name="number"
            value={classData.number}
            onChange={handleChange}
            required
          />
        </label>
        <br />
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
        <br />
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
        <br />
        <label>
          Class Name:
          <input
            type="text"
            name="name"
            value={classData.name}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">Update Class</button>
      </form>
    </div>
  );
};

export default EditClass;
