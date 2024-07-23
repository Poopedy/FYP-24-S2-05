import React, { useEffect, useRef, useState } from 'react';
import { FaUser, FaLock, FaUnlock } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { LuActivitySquare } from "react-icons/lu";
import { PiFilesFill } from "react-icons/pi";
import { HiSparkles } from "react-icons/hi2";
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './UserDashboard.css';

const UserDashboard = () => {
  const [tabs, setTabs] = useState([]);
  const [googleDriveFiles, setGoogleDriveFiles] = useState([]);
  const [oneDriveFiles, setOneDriveFiles] = useState([]);
  const [dropboxFiles, setDropboxFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('');
  const fileInputRef = useRef(null);
  const [isLocked, setIsLocked] = useState(true);
  const [showPassphrasePopup, setShowPassphrasePopup] = useState(false);
  const [inputPassphrase, setInputPassphrase] = useState('');

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
    if (!isLocked && fileInputRef.current) {
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
    let files = [];
    if (activeTab === 'Google Drive') files = googleDriveFiles;
    else if (activeTab === 'OneDrive') files = oneDriveFiles;
    else if (activeTab === 'Dropbox') files = dropboxFiles;

    return (
      <>
        <h2>{activeTab} Files</h2>
        <div className="upload-container">
          <input type="file" id="file-upload" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
          <label htmlFor="file-upload" className="upload-area">
            Click the upload button and browse your files
          </label>
          <button className="upload-button" onClick={handleUploadClick} disabled={isLocked}>Upload</button>
        </div>
        <div className="search-bar">
            <input type="text" placeholder="Search your files..." />
            <button>Search</button>
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

  const handleAddTab = (tabName) => {
    if (tabs.includes(tabName)) {
      alert(`Tab for ${tabName} already exists.`);
      return;
    }
    setTabs(prevTabs => [...prevTabs, tabName]);
    setActiveTab(tabName);
  };

  const handleRemoveTab = (tabName) => {
    setTabs(prevTabs => prevTabs.filter(tab => tab !== tabName));
    if (activeTab === tabName) {
      setActiveTab(tabs.length > 0 ? tabs[0] : '');
    }
  };

  const handleLockToggle = () => {
    if (isLocked) {
      setShowPassphrasePopup(true);
    } else {
      setIsLocked(true);
    }
  };

  const handlePassphraseSubmit = () => {
    if (inputPassphrase === "1234!A") {
      setIsLocked(false);
      setShowPassphrasePopup(false);
      setInputPassphrase('');
    } else {
      alert("Incorrect passphrase!");
    }
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
          <div className="lock-toggle" onClick={handleLockToggle}>
            {isLocked ? <FaLock /> : <FaUnlock />}
          </div>
        </header>
        <div className="tabs">
          {tabs.map(tab => (
            <div key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`}>
              <button className={`tab-button ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
              <button className="remove-tab-button" onClick={() => handleRemoveTab(tab)}>x</button>
            </div>
          ))}
          <Popup trigger={<button className="add-tab-button">+</button>} modal className="popup-modal">
            {close => (
              <div className="modal-container">
                <div className="modal">
                  <h3>Select Cloud Service</h3>
                  <button onClick={() => { handleAddTab('Google Drive'); close(); }}>Google Drive</button>
                  <button onClick={() => { handleAddTab('OneDrive'); close(); }}>OneDrive</button>
                  <button onClick={() => { handleAddTab('Dropbox'); close(); }}>Dropbox</button>
                  <button onClick={close}>Cancel</button>
                </div>
              </div>
            )}
          </Popup>
        </div>
        <div className="content-wrapper">
          <section className="user-file">
            {activeTab ? renderContent() : <p>Please add a tab and select a cloud service.</p>}
          </section>
          <RightSidebar file={selectedFile} />
        </div>
      </div>
      {showPassphrasePopup && (
        <Popup open={showPassphrasePopup} closeOnDocumentClick onClose={() => setShowPassphrasePopup(false)} modal>
          <div className="modal-container">
            <div className="modal">
              <h3>Enter Passphrase</h3>
              <input type="password" value={inputPassphrase} onChange={(e) => setInputPassphrase(e.target.value)} />
              <button onClick={handlePassphraseSubmit}>Submit</button>
              <button onClick={() => setShowPassphrasePopup(false)}>Cancel</button>
            </div>
          </div>
        </Popup>
      )}
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
