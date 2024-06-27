import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ViewClass = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState({});
  const [lecturers, setLecturers] = useState([]);
  const [students, setStudents] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [unenrolledStudents, setUnenrolledStudents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchClass = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/classes/${classId}/`);
        setClassData(response.data);
        setError('');
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch class details');
        setLoading(false);
      }
    };

    const fetchLecturers = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/lecturers/?course=${classData.course && classData.course.id}`);
        setLecturers(response.data);
      } catch (error) {
        console.error('Failed to fetch lecturers:', error);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/students/');
        setStudents(response.data);
      } catch (error) {
        setError('Failed to fetch students');
      }
    };

     const fetchEnrolledStudents = async () => {
        try {
          const enrollmentResponse = await axios.get(`http://localhost:8000/api/enrollments/?classID=${classId}`);
          const enrollments = enrollmentResponse.data;
          const studentIds = enrollments.map(enrollment => enrollment.student);
          const studentPromises = studentIds.map(async studentId => {
            const studentResponse = await axios.get(`http://localhost:8000/api/students/${studentId}/`);
            return studentResponse.data;
          });
          const students = await Promise.all(studentPromises);
          setEnrolledStudents(students);
          console.log(unenrolledStudents)
        } catch (error) {
          setError('Failed to fetch enrolled students');
        }
      };

     const fetchUnenrolledStudents = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/students/');
    const allStudents = response.data;
    const enrollmentResponse = await axios.get(`http://localhost:8000/api/enrollments/?classID=${classId}`);
    const enrollments = enrollmentResponse.data;
    const unenrolledStudents = allStudents.filter(student => {
      return !enrollments.some(enrollment => enrollment.student === student.id);
    });

    setUnenrolledStudents(unenrolledStudents);
  } catch (error) {
    setError('Failed to fetch unenrolled students');
  }
};


    fetchUnenrolledStudents()
    fetchEnrolledStudents()
    fetchStudents();
    fetchClass();
    fetchLecturers();
  }, [classId, classData.course]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/classes/${classId}/`);
      navigate('/classes');
    } catch (error) {
      setError('Failed to delete class');
    }
  };

  const assignLecturer = async (lecturerId) => {
    try {
      await axios.put(`http://localhost:8000/api/classes/${classId}/`, { lecturer: lecturerId });
      const response = await axios.get(`http://localhost:8000/api/classes/${classId}/`);
      setClassData(response.data);
    } catch (error) {
      setError('Failed to assign lecturer');
    }
  };

  const enrollStudent = async (studentId) => {
  try {
    // Step 1: Enroll the student
    await axios.post(`http://localhost:8000/api/enrollments/`, {
      student: studentId,
      classID: classId,
      enrol_time: new Date().toISOString()
    });

    // Step 2: Fetch updated class data (including enrolled students)
    const response = await axios.get(`http://localhost:8000/api/classes/${classId}/`);
    setClassData(response.data);

    window.location.reload();

    // Optionally, you can also fetch updated lists of enrolled and unenrolled students

  } catch (error) {
    setError('Failed to enroll student');
  }
};


  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className="content">
      <h2>Class Details</h2>
      <p><strong>Number:</strong> {classData.number}</p>
      <p><strong>Semester:</strong> {classData.semester && classData.semester.name}</p>
      <p><strong>Course:</strong> {classData.course && classData.course.name}</p>
      <p><strong>Name:</strong> {classData.name}</p>
      {!classData.lecturer ? (
        <div>
          <p><strong>Assign Lecturer:</strong></p>
          <select onChange={(e) => assignLecturer(e.target.value)} defaultValue="">
            <option value="" disabled>Select Lecturer</option>
            {lecturers.map(lecturer => (
              <option key={lecturer.user.id} value={lecturer.user.id}>
                {lecturer.user.first_name} {lecturer.user.last_name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p><strong>Lecturer:</strong> {classData.lecturer.user.first_name} {classData.lecturer.user.last_name}</p>
      )}

      <p><strong>Students:</strong></p>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Grade</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {enrolledStudents.map(student => (
            <tr key={student.user.id}>
              <td>{student.user.first_name}</td>
              <td>{student.user.last_name}</td>
              <td>{student.user.email}</td>
              <td>Assign Grade</td>
              <td><button>Remove from class</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <p><strong>Assign Students:</strong></p>
        <select onChange={(e) => enrollStudent(e.target.value)} defaultValue="">
          <option value="" disabled>Select Student</option>
          {unenrolledStudents.map(student => (
            <option key={student.id} value={student.id}>
              {student.user.first_name} {student.user.last_name}
            </option>
          ))}
        </select>
      </div>

      <Link to={`/classes/${classId}/edit`}>
        <button>Edit Class</button>
      </Link>
      <button onClick={handleDelete}>Delete Class</button>
    </div>
  );
};

export default ViewClass;
