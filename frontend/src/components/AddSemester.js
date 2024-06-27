import React, { useState } from 'react';
import axios from 'axios';

const AddSemester = () => {
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const baseURL = 'http://localhost:8000';

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  const data = {
    semester: parseInt(semester),
    year: parseInt(year),
  };

  try {
    const response = await axios.post(`${baseURL}/api/semesters/`, data);
    if (response.status === 201) {
      setSuccess('Semester added successfully');
      setSemester('');
      setYear('');
    } else {
      setError('Failed to add semester');
    }
  } catch (error) {
    setError('Failed to add semester');
  }
}

  return (
    <div>
      <h2>Add Semester</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Semester: </label>
          <input
            type="number"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Year: </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Semester</button>
      </form>
    </div>
  );
};

export default AddSemester;
