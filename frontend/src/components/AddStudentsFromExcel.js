// FileUploadComponent.jsx

import React, { useState } from 'react';
import axios from 'axios';

const AddStudentsFromExcel = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Replace with your Django backend endpoint for file upload
      const response = await axios.post('http://localhost:8000/api/upload-students/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('File upload successful:', response.data);
      // Optionally handle success feedback or state update after successful upload

    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError('Error uploading file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload Excel File</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>
      {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
    </div>
  );
};

export default AddStudentsFromExcel;
