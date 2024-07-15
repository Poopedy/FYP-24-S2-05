import { gapi } from 'gapi-script';
import React, { useEffect, useRef, useState } from 'react';
import { FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { LuActivitySquare } from "react-icons/lu";
import { PiFilesFill } from "react-icons/pi";
import { HiSparkles } from "react-icons/hi2";
import { Link, useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
  const [googleDriveFiles, setGoogleDriveFiles] = useState([]);
  const [oneDriveFiles, setOneDriveFiles] = useState([]);
  const [dropboxFiles, setDropboxFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('Google Drive');
  const fileInputRef = useRef(null);

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  if (code) {
    // Now send a POST request to your backend to exchange the code for a token

    if (localStorage.getItem("token") == null) {
      fetch('http://localhost:5000/api/getToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
        .then(response => response.json())
        .then(token => {
          console.log('Access token:', token);
          localStorage.setItem('token', JSON.stringify(token));
          location.reload();
          // Store or use the token as needed
        })
        .catch(error => console.error('Error fetching token:', error));
    }

  } else {
    //console.error('Authorization code not found.');
  }

  const fetchFilesFromDrive = async () => {
    // Replace with the actual token from your authentication flow
    const token = localStorage.getItem('token'); 
  
    if (!token) {
      alert('No token found. Please authenticate first.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/readDrive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
  
      const data = await response.json();
      console.log('Files:', data);
  
      // Process the file data as needed
      // For example, display it in the UI or handle it in some other way
  
    } catch (error) {
      console.error('Error fetching files:', error);
      alert('An error occurred while fetching files.');
    }
  };
  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      
      const newFile = {
        filename: uploadedFile.name,
        filetype: uploadedFile.type,
        filesize: `${(uploadedFile.size / 1024).toFixed(2)}KB`,
        file: uploadedFile
      };
      if (activeTab === 'Google Drive') {
        setGoogleDriveFiles(prevFiles => [...prevFiles, newFile]);
      } else if (activeTab === 'OneDrive') {
        setOneDriveFiles(prevFiles => [...prevFiles, newFile]);
      } else if (activeTab === 'Dropbox') {
        setDropboxFiles(prevFiles => [...prevFiles, newFile]);
      }
      console.log(uploadedFile);
      setFile(uploadedFile);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSelectFile = (file) => {
    setSelectedFile(file);
  };

  const uploadFile = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }
  
    try {
      const tokenString = localStorage.getItem('token');
      const token = tokenString ? JSON.parse(tokenString) : null;
  
      if (!token) {
        alert('User not authenticated!');
        return;
      }
  
      const formData = new FormData();
      console.log("File to be uploaded:", file);
      formData.append('file', file);
      formData.append('token', JSON.stringify(token));
  
      const response = await fetch('http://localhost:5000/api/fileUpload', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const responseData = await response.text(); // Use `.json()` if response is JSON
        console.log('Response Data:', responseData);
        alert('File uploaded successfully!');
      } else {
        const errorText = await response.text();
        console.error('File upload failed:', errorText);
        alert('File upload failed!');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred during file upload.');
    }
  };

  const uploadFileToDropbox = async () => {
    if (!file) {
        alert('Please select a file first!');
        return;
    }

    try {
        const token = localStorage.getItem('dbtoken');
        if (!token) {
            alert('User not authenticated!');
            return;
        }

        const formData = new FormData();
        console.log("File to be uploaded:", file);
        formData.append('file', file);
        formData.append('token', token); // Directly append the token as a string

        const response = await fetch('http://localhost:5000/api/dropbox/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('Response Data:', responseData);
            alert('File uploaded successfully to Dropbox!');
        } else {
            const errorText = await response.text();
            console.error('File upload failed:', errorText);
            alert('File upload failed!');
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('An error occurred during file upload.');
    }
};

  

  function connectCloud() {
    console.log("connecting");
    fetch('http://localhost:5000/api/getAuthURL')
      .then(response => response.text())
      .then(url => {
        window.location.href = url; // Redirect user to the Google OAuth2 consent page
      });
  }

  function connectDB() {
    console.log("Connecting to Dropbox");
    fetch('http://localhost:5000/api/dropbox/authorize')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Redirecting to Dropbox authorization page:", data.authUrl);
            window.location.href = data.authUrl; // Redirect user to Dropbox OAuth2 consent page
        })
        .catch(error => console.error('Error fetching Dropbox authorization URL:', error));
}

  const handleRemoveFile = (fileToRemove) => {
    const removeFile = (setFiles) => {
      setFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
      if (selectedFile === fileToRemove) {
        setSelectedFile(null);
      }
    };
    if (activeTab === 'Google Drive') {
      removeFile(setGoogleDriveFiles);
    } else if (activeTab === 'OneDrive') {
      removeFile(setOneDriveFiles);
    } else if (activeTab === 'Dropbox') {
      removeFile(setDropboxFiles);
    }
  };

  const renderContent = () => {
    const files = activeTab === 'Google Drive' ? googleDriveFiles : activeTab === 'OneDrive' ? oneDriveFiles : dropboxFiles;
    return (
      <>
        <h2>{activeTab} Files</h2>
        <div className="upload-container">
          
          <label htmlFor="file-upload" className="upload-area">
            Drag and drop files, browse or click the upload button
          </label>

          <br></br>
          <input type="file" name="file" id="file-upload" ref={fileInputRef} onChange={handleFileChange} />
          
          <button className="upload-button" onClick={fetchFilesFromDrive}>fetchFilesFromDrive</button>
          <button className="upload-button" onClick={uploadFileToDropbox}>Upload</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>File Name</th>
              <th>File Type</th>
              <th>File Size</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((user, index) => (
              <tr key={index}>
                <td>{user.filename}</td>
                <td>{user.filetype}</td>
                <td>{user.filesize}</td>
                <td>
                  <button className="select-button" onClick={() => handleSelectFile(user)}>Select</button>
                  <button className="remove-button" onClick={() => handleRemoveFile(user)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  return (
    <div className="user-dashboard">
      <Sidebar />
      <div className="main-content-user-dashboard">
        <header>
          <div className="welcome">
            <FaUser style={{ marginRight: '10px' }} />
            Welcome, User
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Search your files..." />
            <button>Search</button>
          </div>
        </header>
        <div className="tabs">
          <button className={activeTab === 'Google Drive' ? 'active' : ''} onClick={() => setActiveTab('Google Drive')}>Google Drive</button>
          <button className={activeTab === 'OneDrive' ? 'active' : ''} onClick={() => setActiveTab('OneDrive')}>OneDrive</button>
          <button className={activeTab === 'Dropbox' ? 'active' : ''} onClick={() => setActiveTab('Dropbox')}>Dropbox</button>
        </div>
        <br></br>
        <div className="tabs">
          <button className={activeTab === 'Google Drive' ? 'active' : ''} onClick={() => connectCloud()}>Connect Google Drive</button>
          <button className={activeTab === 'OneDrive' ? 'active' : ''} onClick={() => setActiveTab('OneDrive')}>Connect OneDrive</button>
          <button className={activeTab === 'Dropbox' ? 'active' : ''} onClick={() => connectDB()}>Connect Dropbox</button>
        </div>
        <div className="content-wrapper">
          <section className="user-file">
            {renderContent()}
          </section>
          <RightSidebar file={selectedFile} />
        </div>
      </div>
    </div>
  );
};

const Sidebar = () => (
  <div className="sidebar">
    <div className="logoUser">
      <img src="/images/CipherLinkLogo.png" alt="CipherLink Logo Login" />
      <p>CipherLink Trusted Cloud</p>
    </div>
    <nav>
      <ul>
        <li className="userActive">
          <PiFilesFill style={{ marginRight: '10px' }} />
          My Files
        </li>
        <li className="userNotActive">
          <Link to="/useractivitybilling">
            <LuActivitySquare style={{ marginRight: '10px' }} />
            Activity Log & Billing
          </Link>
        </li>
      </ul>
    </nav>
    <div className="settings-logout">
      <div className="userNotActive">
        <Link to="/usercloudserviceupgrade">
          <HiSparkles style={{ marginRight: '10px' }} />
          Upgrade
        </Link>
      </div>
      <div className="userNotActive">
        <Link to="/useraccmanagement">
          <IoMdSettings style={{ marginRight: '10px' }} />
          Settings
        </Link>
      </div>
      <div className="userNotActive">
        <Link to="/login">
          <IoLogOut style={{ marginRight: '10px' }} />
          Logout
        </Link>
      </div>
    </div>
  </div>
);

const RightSidebar = ({ file }) => {
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file.file);
      setFileUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="right-sidebar">
      <h3>File Details</h3>
      {file ? (
        <>
          <ul>
            <li><strong>File Name:</strong> {file.filename}</li>
            <li><strong>File Type:</strong> {file.filetype}</li>
            <li><strong>File Size:</strong> {file.filesize}</li>
          </ul>
          <button className="preview-button" onClick={() => window.open(fileUrl, '_blank')}>Preview in New Tab</button>
          <button className="download-button" onClick={handleDownload}>Download</button>
          {file.filetype.startsWith('image/') && (
            <img src={fileUrl} alt={file.filename} style={{ maxWidth: '100%' }} />
          )}
          {file.filetype === 'application/pdf' && (
            <iframe src={fileUrl} style={{ width: '100%', height: '500px' }} title={file.filename}></iframe>
          )}
          {file.filetype === 'text/plain' && (
            <iframe src={fileUrl} style={{ width: '100%', height: '500px' }} title={file.filename}></iframe>
          )}
        </>
      ) : (
        <p>Select a file to see the details</p>
      )}
    </div>
  );
};

export default UserDashboard;
