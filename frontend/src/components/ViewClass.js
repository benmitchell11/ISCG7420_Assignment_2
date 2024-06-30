import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ViewClass = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState({});
  const [lecturer, setLecturer] = useState({});
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
        const response = await axios.get(`http://localhost:8000/api/lecturers/get_by_course/?course=${classData.course}`);
        setLecturers(response.data);
      } catch (error) {
        console.error('Failed to fetch lecturers:', error);
      }
    };

   const fetchLecturer = async () => {
  try {
    if (classData.lecturer) {
      const response = await axios.get(`http://localhost:8000/api/lecturers/${classData.lecturer}/`);
      setLecturer(response.data);
    } else {
      setLecturer({});
    }
  } catch (error) {
    console.log(lecturer)
    console.error('Failed to fetch lecturer:', error);
    setError('Failed to fetch lecturer');
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
          const studentData = studentResponse.data;
          const enrollmentData = enrollments.find(enrollment => enrollment.student === studentId);
          return { ...studentData, grade: enrollmentData.grade };
        });
        const students = await Promise.all(studentPromises);
        setEnrolledStudents(students);
        console.log(students);
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
    fetchLecturer();
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
      await axios.put(`http://localhost:8000/api/classes/${classId}/`, { lecturer: lecturerId, course: classData.course, number: classData.number, name: classData.name, semester: classData.semester });
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
        <option key={lecturer.id} value={lecturer.id}>
          {lecturer.user.first_name} {lecturer.user.last_name}
        </option>
      ))}
    </select>
  </div>
) : (
  <div>
    {lecturer.user && (
      <p><strong>Lecturer:</strong> {lecturer.user.first_name} {lecturer.user.last_name}</p>
    )}
  </div>
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
              <td>
                {student.grade ? (
                    <span>{student.grade}</span>
                ) : (
                    <Link to={`/assigngrade/${classData.id}/${student.id}`}>Assign Grade</Link>
                )}
              </td>
              <td>
                <button>Remove from class</button>
              </td>
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
