import React, { useEffect, useRef, useState } from 'react';
import { FaUser, FaLock, FaUnlock } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { LuActivitySquare } from "react-icons/lu";
import { PiFilesFill } from "react-icons/pi";
import { HiSparkles } from "react-icons/hi2";
import { Link, useNavigate  } from 'react-router-dom';
import { encryptFile } from '../../../models/encryptionModel';
import { decryptFile } from '../../../models/decryptionModel';
import Popup from 'reactjs-popup';
import axios from 'axios';
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
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  const getPassphraseFromSession = () => {
    const passphraseData = JSON.parse(sessionStorage.getItem('passphraseData'));
    if (passphraseData) {
        const { passphrase, timestamp } = passphraseData;
        const currentTime = Date.now();

        // Check if the passphrase has expired (30 minutes lifespan)
        if (currentTime - timestamp > 30 * 60 * 1000) {
            sessionStorage.removeItem('passphraseData');
            return null;
        }

        return passphrase;
    }

    return null;
  };

  const getKeyDataFromSession = () => {
    const keyData = JSON.parse(sessionStorage.getItem('keyData'));
    if (keyData) {
      const { keyId, encryptedKey, timestamp } = keyData;
      const currentTime = Date.now();
  
      // Check if the data has expired (30 minutes lifespan)
      if (currentTime - timestamp > 30 * 60 * 1000) {
        sessionStorage.removeItem('keyData');
        return { keyId: null, encryptedKey: null };
      }
  
      return { keyId, encryptedKey };
    }
  
    return { keyId: null, encryptedKey: null };
  };
  
  
  useEffect(() => {
    // Retrieve user data from sessionStorage
    const storedUser = sessionStorage.getItem('user');

    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
    } else {
        // Redirect to login if no user data is found in sessionStorage
        navigate('/login');
    }

    // Set up interval to check passphrase expiration
    const interval = setInterval(() => {
      const storedPassphrase = getPassphraseFromSession();
      if (!storedPassphrase) {
          setIsLocked(true); // Lock the upload button if passphrase is not valid
      }
    }, 1000); // Check every second

    // Clean up interval on component unmount
    return () => clearInterval(interval);
}, [navigate]);

if (!user) {
    return <div>Loading...</div>;
}
  
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
    }
  };

  // get user's encryption key
  const getUserKey = async () => {
    if (!user || !user.id) {
      console.error('User ID not found');
    }
  
    try {
      const response = await axios.get(`http://localhost:5000/api/keys/user/${user.id}`);
  
      if (response.status === 200) {
        const key = response.data;
        console.log('Retrieved encryption key:', key);
        if (key.length === 0) {
          alert('No encryption keys found for this user.');
        } else {
          // Store encryptedKey and keyId in sessionStorage
          const keyData = {
            keyId: key.idKey,
            encryptedKey: key.encryptedkey,
            timestamp: Date.now()
          };
          sessionStorage.setItem('keyData', JSON.stringify(keyData));
  
          // Clear the key data after 30 minutes
          setTimeout(() => {
            sessionStorage.removeItem('keyData');
          }, 30 * 60 * 1000); // 30 minutes lifespan for the key data
        }
      } else {
        alert('Failed to fetch encryption keys.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user keys:', error);
      alert('Error fetching encryption keys. Please try again.');
      return null;
    }
  };
  

  const handlePassphraseSubmit = async () => {
    if (!user || !user.id) {
      alert('User ID not found');
      return;
  }
    try {
      const response = await axios.post('http://localhost:5000/api/validatePassphrase', {
          userId: user.id,
          inputPassphrase: inputPassphrase
      });
      
      if (response.data.message === 'Passphrase is valid') {
        // Store the passphrase with a timestamp in sessionStorage
        const passphraseData = {
            passphrase: inputPassphrase,
            timestamp: Date.now()
        };
        sessionStorage.setItem('passphraseData', JSON.stringify(passphraseData));
        getUserKey();

        // Clear the passphrase after 30 minutes
        setTimeout(() => {
            sessionStorage.removeItem('passphraseData');
        }, 30 * 60 * 1000); // 30 minutes lifespan for the passphrase

        setIsLocked(false);
        setShowPassphrasePopup(false);
        setInputPassphrase('');  // Clear the passphrase input
      }
  } catch (error) {
      console.error('Failed to get user\'s passphrase', error);
      alert("Invalid Passphrase. Please try again.")
  }
  };

  return (
    <div className="user-dashboard">
      <Sidebar />
      <div className="main-content-user-dashboard">
        <header>
          <div className="welcome">
            <FaUser style={{ marginRight: '10px' }} />
            Welcome, {user.username}!
          </div>
          <div className="lock-toggle" onClick={handleLockToggle}>
            {isLocked ? <FaLock size={'1.3em'} /> : <FaUnlock size={'1.3em'}/>}
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

const Sidebar = () => {

  const handleLogOut = () => {
    sessionStorage.clear();
  };

  return (
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
        <Link to="/login" onClick={handleLogOut}>
          <IoLogOut style={{ marginRight: '10px' }} />
          Logout
        </Link>
      </div>
    </div>
  </div>
  );
};

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
