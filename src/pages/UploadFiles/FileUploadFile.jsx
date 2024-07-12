import { gapi } from 'gapi-script';
import React from 'react';
import { useLocation } from 'react-router-dom';
import './FileUploadFile.css';

const FileUploadFile = () => {
  const location = useLocation();
  const { file } = location.state;
  
  const handleClick = () => {
    window.location.href = 'https://drive.google.com/drive/u/0/my-drive';
  };

  const handleUpload = () => {
    if (!file) return;

    const metadata = {
      name: file.name,
      mimeType: file.mimeType,
    };

    const accessToken = gapi.auth.getToken().access_token;

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
      method: 'POST',
      headers: new Headers({ Authorization: 'Bearer ' + accessToken }),
      body: form,
    })
    .then((res) => res.json())
    .then((data) => {
      console.log('File uploaded successfully:', data);
      alert('File uploaded successfully!');
    })
    .catch((error) => {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    });
  };

  return (
    <div className="file-upload-page">
      <h2>Upload File</h2>
      <p>Selected File: {file ? file.name : 'No file selected'}</p>
      {/* <button className="file-upload-button" onClick={handleUpload}>Upload to Google Drive</button> */}
      <button className="file-upload-button" onClick={handleClick}>Upload to Google Drive</button>
    </div>
  );
};

export default FileUploadFile;
