import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the Gradebook System</h1>
      <p>This is the home page of the Gradebook System.</p>
        <ul>
            <li><Link to="/courses">View Courses</Link></li>
            <li><Link to="/semesters">View Semesters</Link></li>
            <li><Link to="/lecturers">View Lecturers</Link></li>
            <li><Link to="/students">View Students</Link></li>
            <li><Link to="/classes">View Classes</Link></li>
            <li><Link to="/addstudentsfromexcel">Add Students from Excel</Link></li>

        </ul>

    </div>
  );
}

export default HomePage;
