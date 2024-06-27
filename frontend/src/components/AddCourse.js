import React, { useState } from 'react';
import axios from 'axios';

const AddCourse = () => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/courses/', { name, code });
      console.log(response.data); // Log the response for debugging
      setSuccess(true);
      setName('');
      setCode('');
    } catch (error) {
      setError('Failed to add course');
    }
  };

  return (
    <div>
      <h2>Add Course</h2>
      {success && <p>Course added successfully!</p>}
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <br />
        <label>
          Code:
          <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required />
        </label>
        <br />
        <button type="submit">Add Course</button>
      </form>
    </div>
  );
};

export default AddCourse;
