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
          <input type="file" id="file-upload" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
          <label htmlFor="file-upload" className="upload-area">
            Drag and drop files, browse or click the upload button
          </label>
          <button className="upload-button" onClick={handleUploadClick}>Upload</button>
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
