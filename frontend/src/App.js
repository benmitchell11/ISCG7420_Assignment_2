import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddSemester from './components/AddSemester';
import SemesterList from './components/SemesterList';
import Home from './components/Home';
import CourseList from "./components/CourseList";
import AddCourse from "./components/AddCourse";
import AddLecturer from "./components/AddLecturer";
import LecturerList from "./components/LecturerList";
import StudentList from "./components/StudentList";
import AddStudent from "./components/AddStudent";
import ClassList from "./components/ClassList";
import AddClass from "./components/AddClass";
import ViewStudent from "./components/ViewStudent";
import AddStudentsFromExcel from "./components/AddStudentsFromExcel";
import ViewClass from "./components/ViewClass";
import ViewLecturer from "./components/ViewLecturer";
import ViewCourse from "./components/ViewCourse";
import ViewSemester from "./components/ViewSemester";
import EditClass from "./components/EditClass";
import EditStudent from "./components/EditStudent";
import EditLecturer from "./components/EditLecturer";
import EditSemester from "./components/EditSemester";
import EditCourse from "./components/EditCourse";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/semesters" element={<SemesterList />} />
        <Route path="/addsemester" element={<AddSemester />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/addcourse" element={<AddCourse />} />
        <Route path="/lecturers" element={<LecturerList />} />
        <Route path="/addlecturer" element={<AddLecturer />} />
        <Route path="/students" element={<StudentList />} />
        <Route path="/addstudent" element={<AddStudent />} />
        <Route path="classes" element={<ClassList />} />
        <Route path="addclass" element={<AddClass />} />
        <Route path="/students/:studentId" element={<ViewStudent />} />
        <Route path="/addstudentsfromexcel" element={<AddStudentsFromExcel />} />
        <Route path="/classes/:classId" element={<ViewClass />} />
        <Route path="/lecturers/:lecturerId" element={<ViewLecturer />} />
        <Route path="/courses/:courseId" element={<ViewCourse />} />
        <Route path="/semesters/:semesterId" element={<ViewSemester />} />
        <Route path="/classes/:classId/edit" element={<EditClass />} />
        <Route path="/courses/:courseId/edit" element={<EditCourse />} />
        <Route path="/students/:studentId/edit" element={<EditStudent />} />
        <Route path="/semesters/:semesterId/edit" element={<EditSemester />} />
        <Route path="/lecturers/:lecturerId/edit" element={<EditLecturer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
