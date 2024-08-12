import { gapi } from 'gapi-script';
import React, { useEffect, useRef, useState } from 'react';
import { FaUser, FaLock, FaUnlock } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { LuActivitySquare } from "react-icons/lu";
import { PiFilesFill } from "react-icons/pi";
import { HiSparkles } from "react-icons/hi2";
import { Link, useNavigate  } from 'react-router-dom';
import { encryptFile } from '../../../models/encryptionModel';
import { decryptFile, decryptWithPassphrase } from '../../../models/decryptionModel';
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
  const [activeTab, setActiveTab] = useState('Google Drive');
  const fileInputRef = useRef(null);
  const [isLocked, setIsLocked] = useState(true);
  const [showPassphrasePopup, setShowPassphrasePopup] = useState(false);
  const [inputPassphrase, setInputPassphrase] = useState('');
  
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const updateToks = true;
  const reftok = urlParams.get('refreshtokens');
  const user = JSON.parse(sessionStorage.getItem('user'));
  if (reftok) {

  }
  if (updateToks) {
    try {
      const jwtToken = localStorage.getItem('token'); // Retrieve the JWT token from localStorage

      if (!jwtToken) {
        console.error('No JWT token found in local storage');
        return;
      }

      fetch('https://cipherlink.xyz:5000/api/gettokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}` // Include the JWT token in the Authorization header
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
          data.forEach(item => {
            switch (item.cloudservice) {
              case 'dropbox':
                localStorage.setItem('dbtoken', item.accesstoken);
                break;
              case 'gdrive':
                localStorage.setItem('gdtoken', item.accesstoken);
                break;
              case 'onedrive':
                localStorage.setItem('odtoken', item.accesstoken);
                break;
              default:
                console.warn(`Unknown cloud service: ${item.cloudservice}`);
                break;
            }
          })
        })
        .catch(error => console.error('Error fetching cloud tokens:', error));

    } catch (error) {
      console.error('Unexpected error:', error);
      // Optionally, handle unexpected errors (e.g., show an error message to the user)
    }
  }


  if (code) {
    // Retrieve the UID from local storage or another source
    const uid = user.id; // Assuming user.id holds the UID

    // Check if the token is already stored
    if (localStorage.getItem("gdtoken") == null) {
      // Send a POST request to your backend to exchange the code for a token
      fetch('https://cipherlink.xyz:5000/api/getToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, uid }), // Include the UID in the request body
      })
        .then(response => response.json())
        .then(token => {
          console.log('Access token:', token);
          localStorage.setItem('gdtoken', JSON.stringify(token));
          window.history.replaceState(null, '', location.pathname);

          // Store or use the token as needed
        })
        .catch(error => console.error('Error fetching token:', error));
    }

  } else {
    // console.error('Authorization code not found.');
  }


  
  
  const getPassphraseFromSession = () => {
    const passphraseData = JSON.parse(sessionStorage.getItem('passphraseData'));
    if (passphraseData) {
        const { passphrase, timestamp } = passphraseData;
        const currentTime = Date.now();

        // Check if the passphrase has expired (5 minutes lifespan)
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
    if (!isLocked && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSelectFile = (file) => {
    setSelectedFile(file);
  };

  const getUserKey = async () => {
    if (!user || !user.id) {
      console.error('User ID not found');
    }
  
    try {
      const response = await axios.get(`http://localhost:5000/api/keys/user/${user.id}`);
      console.log('Response from getUserKey:', response);
  
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

  function getToken() {
    return localStorage.getItem('token'); // Adjust according to your storage mechanism
  }
  async function downloadGdrive(itemId, fileName, keyId) {
    const token = localStorage.getItem("gdtoken"); // Replace with your actual Google Drive token key

    if (!token) {
      console.error('No token found');
      return;
    }
    const passphrase = getPassphraseFromSession();
    if (!passphrase) {
      alert('Passphrase not found or expired!');
      return;
    }

    try {
      // Make a GET request to the download endpoint
      const response = await fetch(`https://cipherlink.xyz:5000/api/download/${itemId}?token=${encodeURIComponent(token)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const encryptedKey = await axios.get(`http://localhost:5000/api/keys/${keyId}`);

      if (response.ok) {
        const blob = await response.blob();

        // decrypt encryption key
        const encryptionKey = decryptWithPassphrase(encryptedKey, passphrase);
        
        // Decrypt the file
        const decryptedBlob = await decryptFile(blob, encryptionKey);
  
        // Create a URL for the decrypted Blob
        const downloadUrl = window.URL.createObjectURL(decryptedBlob);
  
        // Create a link element and trigger the download
        const a = document.createElement('a');
        a.href = downloadUrl;
  
        // Set the desired filename
        a.download = fileName; // Replace with the actual filename and extension
        document.body.appendChild(a);
        a.click();
  
        // Clean up
        a.remove();
        window.URL.revokeObjectURL(downloadUrl); // Revoke the object URL
      } else {
        console.error('Failed to download file');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }

  async function downloadDropbox(fileId,fn, keyId) {
    const token = localStorage.getItem("dbtoken"); // Adjust token retrieval as needed

    if (!token) {
      console.error('No token found');
      return;
    }
    const passphrase = getPassphraseFromSession();
    if (!passphrase) {
      alert('Passphrase not found or expired!');
      return;
    }

    try {
      // Make a POST request to the Dropbox API to download the file
      const response = await fetch(`https://cipherlink.xyz:5000/api/dropbox/download/${fileId}?token=${encodeURIComponent(token)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const encryptedKey = await axios.get(`http://localhost:5000/api/keys/${keyId}`);

      if (response.ok) {
        const blob = await response.blob();
        
        // decrypt encryption key
        const encryptionKey = decryptWithPassphrase(encryptedKey, passphrase);
        
        // Decrypt the file
        const decryptedBlob = await decryptFile(blob, encryptionKey);
  
        // Create a URL for the decrypted Blob and trigger download
        const downloadUrl = window.URL.createObjectURL(decryptedBlob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fn;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl); // Clean up URL object
      } else {
        console.error('Failed to download file');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }

  //   async function 
  async function downloadOneDrive(itemid,fn, keyId) {
    const token = localStorage.getItem("odtoken");

    if (!token) {
        console.error('No token found');
        return;
    }
    const passphrase = getPassphraseFromSession();
    if (!passphrase) {
      alert('Passphrase not found or expired!');
      return;
    }

    try {
        // Make a GET request to the download endpoint
        const response = await fetch(`https://cipherlink.xyz:5000/api/onedrive/download/${itemid}?token=${encodeURIComponent(token)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const encryptedKey = await axios.get(`http://localhost:5000/api/keys/${keyId}`);

        if (response.ok) {
          const blob = await response.blob();
          
          // decrypt encryption key
          const encryptionKey = decryptWithPassphrase(encryptedKey, passphrase);
          
          // Decrypt the file
          const decryptedBlob = await decryptFile(blob, encryptionKey);

          // Create a URL for the decrypted Blob
          const downloadUrl = window.URL.createObjectURL(decryptedBlob);

          // Create a link element and trigger the download
          const a = document.createElement('a');
          a.href = downloadUrl;

          // Set the desired filename
          a.download = fn; // Replace with the actual filename and extension
          document.body.appendChild(a);
          a.click();

          // Clean up
          a.remove();
          window.URL.revokeObjectURL(downloadUrl); // Revoke the object URL
        } else {
            console.error('Failed to download file');
        }
    } catch (error) {
        console.error('Error downloading file:', error);
    }
  }

  // Helper function to decrypt file
  

  async function deleteDropbox(fileId, uid) {
    const token = localStorage.getItem("dbtoken");

    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`https://cipherlink.xyz:5000/api/dropbox/delete/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          token: token,
          uid: uid
        })
      });

      if (response.ok) {
        console.log('File deleted successfully');
        // You can add any additional code here to update the UI after deletion
        fetchFilesByUid('dropbox');
      } else {
        console.error('Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  async function deleteOneDrive(itemid,uid) {
    const token = localStorage.getItem("odtoken");

    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`https://cipherlink.xyz:5000/api/onedrive/delete/${itemid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          token: token,
          uid: uid
        })
      });

      if (response.ok) {
        console.log('File deleted successfully');
        fetchFilesByUid('onedrive');
        // You can add any additional code here to update the UI after deletion
      } else {
        console.error('Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }
  async function deleteGdrive(itemid, uid) {
    const token = localStorage.getItem("gdtoken");

    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`https://cipherlink.xyz:5000/api/delete/${itemid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          token: token,
          uid: uid
        })
      });

      if (response.ok) {
        console.log('File deleted successfully');
        fetchFilesByUid('drive');
        // Additional UI updates can be added here after deletion
      } else {
        console.error('Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  function formatFileSize(bytes) {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
      bytes /= 1024;
      i++;
    }
    return `${bytes.toFixed(2)} ${units[i]}`;
  }
  async function fetchFilesByUid(service) {
    const token = getToken();

    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch('https://cipherlink.xyz:5000/api/getFilesByUid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include the JWT token in the Authorization header
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Files:', data);

      // Filter files based on the selected service
      const filteredData = data.filter(file => file.filelocation === service);

      populateTable(filteredData);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  }

  function populateTable(data) {
    const tableBody = document.querySelector('#dynamic-table tbody');
    tableBody.innerHTML = '';

    data.forEach(file => {
      const row = document.createElement('tr');

      const fileNameCell = document.createElement('td');
      fileNameCell.textContent = file.filename || 'N/A';
      row.appendChild(fileNameCell);

      const fileTypeCell = document.createElement('td');
      fileTypeCell.textContent = file.filetype || 'N/A';
      row.appendChild(fileTypeCell);

      const fileSizeCell = document.createElement('td');
      fileSizeCell.textContent = formatFileSize(file.filesize);
      row.appendChild(fileSizeCell);

      const actionsCell = document.createElement('td');

      const downloadButton = document.createElement('button');
      downloadButton.textContent = 'Download';

      if (file.filelocation === "dropbox") {
        downloadButton.addEventListener('click', () => downloadDropbox(file.itemid,file.filename,file.keyid));
      } else if (file.filelocation === "onedrive") {
        downloadButton.addEventListener('click', () => downloadOneDrive(file.itemid,file.filename,file.keyid));
      } else if (file.filelocation === "drive") {
        downloadButton.addEventListener('click', () => downloadGdrive(file.itemid,file.filename,file.keyid));
      }
      actionsCell.appendChild(downloadButton);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';

      if (file.filelocation === "dropbox") {
        deleteButton.addEventListener('click', () => deleteDropbox(file.itemid,user.id));
      } else if (file.filelocation === "onedrive") {
        deleteButton.addEventListener('click', () => deleteOneDrive(file.itemid,user.id));
      } else if (file.filelocation === "drive") {
        deleteButton.addEventListener('click', () => deleteGdrive(file.itemid,user.id));
      }
      actionsCell.appendChild(deleteButton);

      row.appendChild(actionsCell);
      tableBody.appendChild(row);
    });
  }

  const uploadFile = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }
    const passphrase = getPassphraseFromSession();
    if (!passphrase) {
      alert('Passphrase not found or expired!');
      return;
    }
    const { keyId, encryptedKey } = getKeyDataFromSession();
    if (!keyId || !encryptedKey) {
      alert('Encryption key data not available or expired.');
      return;
    }

    try {
      const token = localStorage.getItem('gdtoken'); // Replace 'gdriveToken' with your actual token key
      if (!token) {
        alert('User not authenticated!');
        return;
      }

      // decrypt encryption key
      const encryptionKey = decryptWithPassphrase(encryptedKey, passphrase);
      // Encrypt the file before uploading
      const encryptedFile = await encryptFile(file,encryptionKey);

      const formData = new FormData();
      console.log("File to be uploaded:", encryptedFile);
      formData.append('file', encryptedFile, file.name); // Use the original file name
      formData.append('token', token); // Directly append the token as a string
      formData.append('uid', user.id);
      formData.append('keyid', keyId);

      const response = await fetch('https://cipherlink.xyz:5000/api/fileUpload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Response Data:', responseData);
        alert('File uploaded successfully to Google Drive!');
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
    const passphrase = getPassphraseFromSession();
    if (!passphrase) {
      alert('Passphrase not found or expired!');
      return;
    }
    const { keyId, encryptedKey } = getKeyDataFromSession();
    if (!keyId || !encryptedKey) {
      alert('Encryption key data not available or expired.');
      return;
    }

    try {
      const token = localStorage.getItem('dbtoken');
      if (!token) {
        alert('User not authenticated!');
        return;
      }
      // decrypt encryption key
      const encryptionKey = decryptWithPassphrase(encryptedKey, passphrase);

      let encryptedFile = await encryptFile(file,encryptionKey);
      console.log(file.type);
      console.log(file.name);
      const formData = new FormData();
      console.log("File to be uploaded:", file);
      formData.append('ft', file.type);
      formData.append('fn', file.name);
      formData.append('file', encryptedFile);
      formData.append('token', token); // Directly append the token as a string
      formData.append('uid', user.id);
      formData.append('keyid', keyId);
      const response = await fetch('https://cipherlink.xyz:5000/api/dropbox/upload', {
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

  // const uploadFileToOneDrive = async () => {
  //   if (!file) {
  //     alert('Please select a file first!');
  //     return;
  //   }

  //   try {
  //     const token = localStorage.getItem('odtoken');
  //     if (!token) {
  //       alert('User not authenticated!');
  //       return;
  //     }

  //     const formData = new FormData();
  //     console.log("File to be uploaded:", file);
  //     formData.append('file', file);
  //     formData.append('token', token); // Directly append the token as a string
  //     formData.append('uid', user.id);


  //     const response = await fetch('https://cipherlink.xyz:5000/api/onedrive/upload', {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     if (response.ok) {
  //       const responseData = await response.json();
  //       console.log('Response Data:', responseData);
  //       alert('File uploaded successfully to OneDrive!');
  //     } else {
  //       const errorText = await response.text();
  //       console.error('File upload failed:', errorText);
  //       alert('File upload failed!');
  //     }
  //   } catch (error) {
  //     console.error('Error uploading file:', error);
  //     alert('An error occurred during file upload.');
  //   }
  // };


  //TESTING ENCRYPTION FOR DELWYN PART 
  const encryptionKeyMaterial = new Uint8Array([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f,
    0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f
  ]);
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
  
  async function getCryptoKey(keyMaterial) {
    return crypto.subtle.importKey(
      'raw',
      keyMaterial,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  }
  
  
  
  const uploadFileToOneDrive = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }
    const passphrase = getPassphraseFromSession();
    if (!passphrase) {
      alert('Passphrase not found or expired!');
      return;
    }

    const { keyId, encryptedKey } = getKeyDataFromSession();
    if (!keyId || !encryptedKey) {
      alert('Encryption key data not available or expired.');
      return;
    }
  
    try {
      const token = localStorage.getItem('odtoken');
      if (!token) {
        alert('User not authenticated!');
        return;
      }
      // decrypt encryption key
      const encryptionKey = decryptWithPassphrase(encryptedKey, passphrase);
  
      // Encrypt the file before uploading
      const encryptedFile = await encryptFile(file,encryptionKey);
  
      const formData = new FormData();
      console.log("File to be uploaded:", encryptedFile);
      formData.append('file', encryptedFile, file.name); // Use original file name
      formData.append('token', token); // Directly append the token as a string
      formData.append('uid', user.id);
      formData.append('keyid', keyId);
  
      const response = await fetch('https://cipherlink.xyz:5000/api/onedrive/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Response Data:', responseData);
        alert('File uploaded successfully to OneDrive!');
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

  // function connectCloud() {
  //   console.log("connecting");
  //   const uid = user.id; 
  //   fetch('https://cipherlink.xyz:5000/api/getAuthURL?uid={}')
  //     .then(response => response.text())
  //     .then(url => {
  //       window.location.href = url; // Redirect user to the Google OAuth2 consent page
  //     });
  // }

  function connectCloud() {
    console.log("Connecting to Google Drive");

    const uid = user.id; // Retrieve the UID from local storage

    if (!uid) {
      console.error('No user ID found in local storage');
      return;
    }

    fetch(`https://cipherlink.xyz:5000/api/getAuthURL?token=${uid}`, {
      method: 'GET',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(authUrl => {
        console.log("Redirecting to Google Drive authorization page:", authUrl);
        window.location.href = authUrl; // Redirect user to Google OAuth2 consent page
      })
      .catch(error => console.error('Error fetching Google Drive authorization URL:', error));

    console.log("HELLO WORLD");
  }


  // THINK NOT USED MAYBE REMOVED
  // async function getDropboxToken() {
  //   try {
  //     const response = await fetch('https://cipherlink.xyz:5000/api/dropbox/get-token', {
  //       method: 'GET',
  //       credentials: 'include' // This ensures cookies are sent with the request
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log('Dropbox Token:', data.token);
  //       // Now you can use the token as needed
  //       return data.token; // Return the token if needed
  //     } else {
  //       console.error('Failed to fetch token:', response.statusText);
  //       return null; // Return null if the request failed
  //     }
  //   } catch (error) {
  //     console.error('Error fetching token:', error);
  //     return null; // Return null if an error occurred
  //   }
  // }

  function connectDB() {
    console.log("Connecting to Dropbox");

    const uid = user.id; // Retrieve the UID from local storage

    if (!uid) {
      console.error('No user ID found in local storage');
      return;
    }

    fetch(`https://cipherlink.xyz:5000/api/dropbox/authorize?uid=${uid}`, {
      method: 'GET',
    })
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

    console.log("HELLO WORLD");
  }

  function connectOneDrive() {
    console.log("Connecting to OneDrive");

    const uid = user.id; // Retrieve the UID from local storage

    if (!uid) {
      console.error('No user ID found in local storage');
      return;
    }

    fetch(`https://cipherlink.xyz:5000/api/onedrive/authorize?uid=${uid}`, {
      method: 'GET',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log("Redirecting to OneDrive authorization page:", data.authUrl);
        window.location.href = data.authUrl; // Redirect user to OneDrive OAuth2 consent page
      })
      .catch(error => console.error('Error fetching OneDrive authorization URL:', error));

    console.log("HELLO WORLD");
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
    const handleUpload = () => {
      switch (activeTab) {
        case 'Google Drive':
          uploadFile();
          break;
        case 'OneDrive':
          uploadFileToOneDrive();
          break;
        case 'Dropbox':
          uploadFileToDropbox();
          break;
        default:
          console.warn('No service selected');
      }
    };
    return (
      <>
        <h2>{activeTab} Files</h2>
        <div className="upload-container">

        <input type="file" id="file-upload" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
          <label htmlFor="file-upload" className="upload-area">
            Click the upload button and browse your files
          </label>

          {/* TEST USING THESE BUTTONS FIRST to merge with frontend 
          <input type="file" name="file" id="file-upload" ref={fileInputRef} onChange={handleFileChange} />
          <button className="upload-button" onClick={() => fetchFilesByUid('dropbox')}>fetchFiles db</button>
          <button className="upload-button" onClick={() => fetchFilesByUid('drive')}>fetchFiles gdrive</button>
          <button className="upload-button" onClick={() => fetchFilesByUid('onedrive')}>fetchFiles onedrive</button> */}
          <button className="upload-button" onClick={handleUpload} disabled={isLocked}>Upload</button>
        </div>
        <table id="dynamic-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>File Type</th>
              <th>File Size</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>

          </tbody>
        </table>
        {/* <div id="pagination-controls">
          <button id="prev-page">Previous</button>
          <span id="page-info"></span>
          <button id="next-page">Next</button>
        </div> */}
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
    if (tabName === 'Google Drive') {
      connectCloud();
    } else if (tabName === 'OneDrive') {
      connectOneDrive();
    } else if (tabName === 'Dropbox') {
      connectDB();
    }
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

  const handlePassphraseSubmit = async () => {
    if (!user || !user.id) {
      alert('User ID not found');
      return;
  }
    try {
      const response = await axios.post('https://cipherlink.xyz:5000/api/validatePassphrase', {
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

        // Clear the passphrase after 5 minutes
        setTimeout(() => {
            sessionStorage.removeItem('passphraseData');
        }, 30 * 60 * 1000); // 5 minutes lifespan for the passphrase

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
            Welcome, {user.username}
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Search your files..." />
            <button>Search</button>
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
        <br></br>
        <div className="content-wrapper">
          <section className="user-file">
            {renderContent()}
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
