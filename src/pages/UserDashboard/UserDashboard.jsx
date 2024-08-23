import { gapi } from 'gapi-script';
import React, { useEffect, useRef, useState } from 'react';
import { FaUser, FaLock, FaUnlock } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { LuActivitySquare } from "react-icons/lu";
import { PiFilesFill } from "react-icons/pi";
import { HiSparkles } from "react-icons/hi2";
import { Link, useNavigate } from 'react-router-dom';
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
  const [files, setFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('Google Drive');
  const fileInputRef = useRef(null);
  const [isLocked, setIsLocked] = useState(true);
  const [showPassphrasePopup, setShowPassphrasePopup] = useState(false);
  const [inputPassphrase, setInputPassphrase] = useState('');
  const [user, setUser] = useState('');
  const [plan, setPlan] = useState('1');
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const updateToks = true;
  const reftok = urlParams.get('refreshtokens');

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


  // if (code) {
  //   // Retrieve the UID from local storage or another source
  //   const uid = user.id; // Assuming user.id holds the UID

  //   // Check if the token is already stored
  //   if (!localStorage.getItem("gdtoken")) {
  //     // Send a POST request to your backend to exchange the code for a token
  //     fetch('https://cipherlink.xyz:5000/api/getToken', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ code, uid }), // Include the UID in the request body
  //     })
  //       .then(response => response.text()) // Use .text() since you're getting plain text
  //       .then(accessToken => {
  //         console.log('Access token:', accessToken);
  //         try {
  //           localStorage.setItem('gdtoken', accessToken); // Store the access token directly
  //         } catch (e) {
  //           console.error('Error saving token to localStorage:', e);
  //         }
  //         window.location.reload();

  //         // Store or use the token as needed
  //       })
  //       .catch(error => console.error('Error fetching token:', error));
  //   }
  // } else {
  //   console.error('Authorization code not found.');
  // }




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
      setPlan(user.planid);
      console.log(user);
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
      // if (activeTab === 'Google Drive') {
      //   setGoogleDriveFiles(prevFiles => [...prevFiles, newFile]);
      // } else if (activeTab === 'OneDrive') {
      //   setOneDriveFiles(prevFiles => [...prevFiles, newFile]);
      // } else if (activeTab === 'Dropbox') {
      //   setDropboxFiles(prevFiles => [...prevFiles, newFile]);
      // }
      console.log(uploadedFile);
      setFile(uploadedFile);
      setPreviewFile(newFile);

    }
  };
  // const handleFileChange = (event) => {
  //   const selectedFile = event.target.files[0];
  //   if (selectedFile) {
  //     // setFile({
  //     //   file: selectedFile,
  //     //   filename: selectedFile.name,
  //     //   filetype: selectedFile.type,
  //     //   filesize: selectedFile.size,
  //     // });
  //     console.log(selectedFile instanceof File);
  //     setFile(selectedFile);
  //   }
  // };

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
      const response = await axios.get(`https://cipherlink.xyz:5000/api/keys/user/${user.id}`);
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
      const encryptedData = await axios.get(`https://cipherlink.xyz:5000/api/keys/${keyId}`);
      console.log(encryptedData);
      console.log(typeof encryptedData);
      
      const encryptedKey = encryptedData.data.encryptedkey;
      console.log(encryptedKey);
      console.log(typeof encryptedKey);
      console.log(encryptedKey instanceof Uint8Array);
      console.log(encryptedKey.length);

      if (response.ok) {
        const blob = await response.blob();

        // decrypt encryption key
        const encryptionKey = await decryptWithPassphrase(encryptedKey, passphrase);
        // check whether is it 256 bit key
        const keyBuffer = await window.crypto.subtle.exportKey('raw', encryptionKey);
        const keyArray = new Uint8Array(keyBuffer);
        console.log(keyArray.length * 8);
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
  };

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
      const encryptedData = await axios.get(`https://cipherlink.xyz:5000/api/keys/${keyId}`);
      console.log(encryptedData);
      console.log(typeof encryptedData);
      
      const encryptedKey = encryptedData.data.encryptedkey;
      console.log(encryptedKey);
      console.log(typeof encryptedKey);
      console.log(encryptedKey instanceof Uint8Array);
      console.log(encryptedKey.length);

      if (response.ok) {
        const blob = await response.blob();
        
        // decrypt encryption key
        const encryptionKey = await decryptWithPassphrase(encryptedKey, passphrase);
        // check whether is it 256 bit key
        const keyBuffer = await window.crypto.subtle.exportKey('raw', encryptionKey);
        const keyArray = new Uint8Array(keyBuffer);
        console.log(keyArray.length * 8);
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
  };

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
        const encryptedData = await axios.get(`https://cipherlink.xyz:5000/api/keys/${keyId}`);
        console.log(encryptedData);
        console.log(typeof encryptedData);
        
        const encryptedKey = encryptedData.data.encryptedkey;
        console.log(encryptedKey);
        console.log(typeof encryptedKey);
        console.log(encryptedKey instanceof Uint8Array);
        console.log(encryptedKey.length);


        if (response.ok) {
          const blob = await response.blob();
          
          // decrypt encryption key
          const encryptionKey = await decryptWithPassphrase(encryptedKey, passphrase);
          // check whether is it 256 bit key
          const keyBuffer = await window.crypto.subtle.exportKey('raw', encryptionKey);
          const keyArray = new Uint8Array(keyBuffer);
          console.log(keyArray.length * 8);
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
          alert('File downloaded successfully from OneDrive!');
        } else {
            console.error('Failed to download file');
        }
    } catch (error) {
        console.error('Error downloading file:', error);
    }
  };

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
  };

  async function deleteOneDrive(itemid, uid) {
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
  };
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
  };

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
      setFiles(filteredData)
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

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
        downloadButton.addEventListener('click', () => downloadDropbox(file.itemid, file.filename, file.keyid));
      } else if (file.filelocation === "onedrive") {
        downloadButton.addEventListener('click', () => downloadOneDrive(file.itemid, file.filename, file.keyid));
      } else if (file.filelocation === "drive") {
        downloadButton.addEventListener('click', () => downloadGdrive(file.itemid, file.filename, file.keyid));
      }
      actionsCell.appendChild(downloadButton);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';

      if (file.filelocation === "dropbox") {
        deleteButton.addEventListener('click', () => deleteDropbox(file.itemid, user.id));
      } else if (file.filelocation === "onedrive") {
        deleteButton.addEventListener('click', () => deleteOneDrive(file.itemid, user.id));
      } else if (file.filelocation === "drive") {
        deleteButton.addEventListener('click', () => deleteGdrive(file.itemid, user.id));
      }
      actionsCell.appendChild(deleteButton);

      row.appendChild(actionsCell);
      tableBody.appendChild(row);
    });
  };
  function populateSearchTable(data) {
    const tableBody = document.querySelector('#dynamic-searchtable tbody');
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
        downloadButton.addEventListener('click', () => downloadDropbox(file.itemid, file.filename, file.keyid));
      } else if (file.filelocation === "onedrive") {
        downloadButton.addEventListener('click', () => downloadOneDrive(file.itemid, file.filename, file.keyid));
      } else if (file.filelocation === "drive") {
        downloadButton.addEventListener('click', () => downloadGdrive(file.itemid, file.filename, file.keyid));
      }
      actionsCell.appendChild(downloadButton);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';

      if (file.filelocation === "dropbox") {
        deleteButton.addEventListener('click', () => deleteDropbox(file.itemid, user.id));
      } else if (file.filelocation === "onedrive") {
        deleteButton.addEventListener('click', () => deleteOneDrive(file.itemid, user.id));
      } else if (file.filelocation === "drive") {
        deleteButton.addEventListener('click', () => deleteGdrive(file.itemid, user.id));
      }
      actionsCell.appendChild(deleteButton);

      row.appendChild(actionsCell);
      tableBody.appendChild(row);
    });
  };

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
    console.log(encryptedKey);
    console.log(typeof encryptedKey);
    console.log(encryptedKey instanceof Uint8Array);
    console.log(encryptedKey.length);

    try {
      const token = localStorage.getItem('gdtoken'); // Replace 'gdriveToken' with your actual token key
      if (!token) {
        alert('User not authenticated!');
        return;
      }

      // decrypt encryption key
      const encryptionKey = await decryptWithPassphrase(encryptedKey, passphrase);
      // check whether is it 256 bit key
      const keyBuffer = await window.crypto.subtle.exportKey('raw', encryptionKey);
      const keyArray = new Uint8Array(keyBuffer);
      console.log(keyArray.length * 8);
      // Encrypt the file before uploading
      const encryptedFile = await encryptFile(file,encryptionKey);

      const encryptedBlob = encryptedFile.encryptedBlob;

      const formData = new FormData();
      console.log("File to be uploaded:", encryptedFile);
      formData.append('file', encryptedBlob, file.name); // Use the original file name
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
    console.log(encryptedKey);
    console.log(typeof encryptedKey);
    console.log(encryptedKey instanceof Uint8Array);
    console.log(encryptedKey.length);

    try {
      const token = localStorage.getItem('dbtoken');
      if (!token) {
        alert('User not authenticated!');
        return;
      }
      // decrypt encryption key
      const encryptionKey = await decryptWithPassphrase(encryptedKey, passphrase);
      // check whether is it 256 bit key
      const keyBuffer = await window.crypto.subtle.exportKey('raw', encryptionKey);
      const keyArray = new Uint8Array(keyBuffer);
      console.log(keyArray.length * 8);

      let encryptedFile = await encryptFile(file,encryptionKey);
      const encryptedBlob = encryptedFile.encryptedBlob;

      console.log(file.type);
      console.log(file.name);
      const formData = new FormData();
      console.log("File to be uploaded:", file);
      formData.append('ft', file.type);
      formData.append('fn', file.name);
      formData.append('file', encryptedBlob);
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
  };
  // async function encryptFile(file) {    // Convert file to array buffer
  //   const arrayBuffer = await file.arrayBuffer();  
  //   // Get the CryptoKey object from the raw key material    
  //   const cryptoKey = await getCryptoKey(encryptionKeyMaterial);
  //     // Encrypt the file data
  //   const encryptedBuffer = await crypto.subtle.encrypt(      {
  //       name: 'AES-GCM',        
  //       iv: iv, // Initialization vector (should be randomly generated in practice)
  //     },
  //     cryptoKey, // Use the CryptoKey object      
  //     arrayBuffer
  //   );    
  //   const blobr = new Blob([iv, new Uint8Array(encryptedBuffer)], { 
  //     type: file.type });
  //   console.log(blobr);    return blobr;
  // }  
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
    console.log(passphrase);

    const { keyId, encryptedKey } = getKeyDataFromSession();
    if (!keyId || !encryptedKey) {
      alert('Encryption key data not available or expired.');
      return;
    }
    console.log(encryptedKey);
    console.log(typeof encryptedKey);
    console.log(encryptedKey instanceof Uint8Array);
    console.log(encryptedKey.length);

    try {
      const token = localStorage.getItem('odtoken');
      if (!token) {
        alert('User not authenticated!');
        return;
      }
  
      // decrypt encryption key
      const encryptionKey = await decryptWithPassphrase(encryptedKey, passphrase);
      // check whether is it 256 bit key
      const keyBuffer = await window.crypto.subtle.exportKey('raw', encryptionKey);
      const keyArray = new Uint8Array(keyBuffer);
      console.log(keyArray.length * 8);
      // Encrypt the file before uploading
      const encryptedFile = await encryptFile(file, encryptionKey);
      // Check the Blob
      console.log(encryptedFile);
      console.log(encryptedFile instanceof Blob);

      const encryptedBlob = encryptedFile.encryptedBlob;
  
      const formData = new FormData();
      console.log("File to be uploaded:", encryptedFile);
      formData.append('file', encryptedBlob, file.name); // Use original file name
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


  // const uploadFileToOneDrive = async () => {
  //   console.log(file);
  //   console.log('hello');
  //   console.log(file.size);
  //   if (!file) {
  //     alert('Please select a file first!');
  //     return;
  //   }
  //   const passphrase = getPassphraseFromSession();
  //   if (!passphrase) {
  //     alert('Passphrase not found or expired!');
  //     return;
  //   }
  //   console.log(passphrase);
  //   const { keyId, encryptedKey } = getKeyDataFromSession();
  //   if (!keyId || !encryptedKey) {
  //     alert('Encryption key data not available or expired.');
  //     return;
  //   }
  //   console.log(encryptedKey);
  //   try {
  //     const token = localStorage.getItem('odtoken');
  //     if (!token) {
  //       alert('User not authenticated!');
  //       return;
  //     }
  //     // decrypt encryption key
  //     const encryptionKey = await decryptWithPassphrase(encryptedKey, passphrase);

  //     if (encryptionKey instanceof CryptoKey) {
  //         console.log("The encryption key is a valid CryptoKey object.");
  //     } else {
  //         console.error("The encryption key is NOT a CryptoKey. Something went wrong during decryption.");
  //          console.error("Decryption failed. Returned value:", encryptionKey);
  //     }

  //     // Encrypt the file before uploading
  //     console.log(file);
  //     console.log('hello');
  //     console.log(file.size);

  //     const encryptedFile = await encryptFile(file,encryptionKey);
  //     console.log(encryptedFile);
  //     const formData = new FormData();
  //     console.log("File to be uploaded:", encryptedFile);
  //     formData.append('file', encryptedFile, file.name); // Use original file name
  //     formData.append('token', token); // Directly append the token as a string
  //     formData.append('uid', user.id);
  //     formData.append('keyid', keyId);

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
  //       console.log('File upload failed:', errorText);
  //       alert('File upload failed!');
  //     }
  //   } catch (error) {
  //     console.error('Error uploading file:', error);
  //     alert('An error occurred during file upload.');
  //   }
  // };

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

    fetch(`https://cipherlink.xyz:5000/api/authorize?uid=${uid}`, {
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Redirecting to Google Drive authorization page:", data.authUrl);
            window.location.href = data.authUrl; // Redirect user to Google Drive OAuth2 consent page
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
  useEffect(() => {
    // Load the tabs from localStorage when the component mounts
    const storedTabs = JSON.parse(localStorage.getItem('tabs')) || [];
    const googleToken = localStorage.getItem('gdtoken');
    const oneDriveToken = localStorage.getItem('odtoken');
    const dropboxToken = localStorage.getItem('dbtoken');

    const initialTabs = [...storedTabs];

    // Check for tokens and add tabs if tokens exist
    if (googleToken && !initialTabs.includes('Google Drive')) {
      initialTabs.push('Google Drive');
    }
    if (oneDriveToken && !initialTabs.includes('OneDrive')) {
      initialTabs.push('OneDrive');
    }
    if (dropboxToken && !initialTabs.includes('Dropbox')) {
      initialTabs.push('Dropbox');
    }

    setTabs(initialTabs);
    if (initialTabs.length > 0) {
      setActiveTab(initialTabs[0]);
    }
  }, []);

  useEffect(() => {
    // Store the tabs in localStorage whenever they change
    localStorage.setItem('tabs', JSON.stringify(tabs));
  }, [tabs]);

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    // Add any visual cues for drag over if needed
  };
  
  // Helper function to update the file input display
  const updateFileInput = (files) => {
    const fileInputElement = document.getElementById('file-upload');
    const dataTransfer = new DataTransfer();
  
    // Add the dropped file to the DataTransfer object
    for (let i = 0; i < files.length; i++) {
      dataTransfer.items.add(files[i]);
    }
  
    // Assign the DataTransfer's FileList to the input's files property
    fileInputElement.files = dataTransfer.files;
  };
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log("dropped");
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      // Assuming you're handling only single file upload
      setPreviewFile(droppedFiles[0]);
      updateFileInput(droppedFiles);
    }
  };
  


  const renderContent = () => {
    // const files = activeTab === 'Google Drive' ? googleDriveFiles : activeTab === 'OneDrive' ? oneDriveFiles : dropboxFiles;
    const handleUpload = async () => {
      switch (activeTab) {
        case 'Google Drive':
          await uploadFile();  // Upload to Google Drive
          fetchFilesByUid('drive');  // Fetch files from Google Drive
          break;
        case 'OneDrive':
          await uploadFileToOneDrive();  // Upload to OneDrive
          fetchFilesByUid('onedrive');  // Fetch files from OneDrive
          break;
        case 'Dropbox':
          await uploadFileToDropbox();  // Upload to Dropbox
          fetchFilesByUid('dropbox');  // Fetch files from Dropbox
          break;
        default:
          console.warn('No service selected');
      }
    };
    const handleRefresh = () => {
      switch (activeTab) {
        case 'Google Drive':
          fetchFilesByUid('drive');  // Fetch files from Google Drive
          break;
        case 'OneDrive':
          fetchFilesByUid('onedrive');  // Fetch files from OneDrive
          break;
        case 'Dropbox':
          fetchFilesByUid('dropbox');  // Fetch files from Dropbox
          break;
        default:
          console.warn('No service selected');
      }
    };
    const [searchQuery, setSearchQuery] = useState('');
    
    // Function to handle search input change
    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
      populateSearchTable(filteredFiles);
    };

    // Function to filter files based on search query
    const filteredFiles = files ? files.filter(file => 
      file.filename.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    // For big files
    async function splitFileAndUploadToOneDrive() {
      const accessToken = localStorage.getItem('odtoken'); // Get OneDrive access token
    
      if (!file) {
          console.error('No file selected');
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
      console.log(encryptedKey);
      console.log(typeof encryptedKey);
      console.log(encryptedKey instanceof Uint8Array);
      console.log(encryptedKey.length);
    
      const chunkSize = 10 * 1024 * 1024; // 10MB chunk size
      const totalChunks = Math.ceil(file.size / chunkSize);
    
      try {
          // Start upload session
          const startResponse = await fetch('https://graph.microsoft.com/v1.0/me/drive/root:/'+ file.name +':/createUploadSession', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
              }
          });
    
          if (!startResponse.ok) {
              throw new Error('Failed to start upload session');
          }
    
          const startData = await startResponse.json();
          const uploadUrl = startData.uploadUrl; // The URL to which chunks will be uploaded
          // decrypt encryption key
          const encryptionKey = await decryptWithPassphrase(encryptedKey, passphrase);
          // check whether is it 256 bit key
          const keyBuffer = await window.crypto.subtle.exportKey('raw', encryptionKey);
          const keyArray = new Uint8Array(keyBuffer);
          console.log(keyArray.length * 8);
          
          let totalEncryptedSize = 0;
          const encryptedChunks = [];

          for (let i = 0; i < totalChunks; i++) {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            const chunk = file.slice(start, end);

            // Encrypt chunk before uploading
            const encryptedChunk = await encryptFile(chunk, encryptionKey);
            const encryptedBlob = encryptedChunk.encryptedBlob;
            
            totalEncryptedSize += encryptedBlob.size;
            encryptedChunks.push(encryptedBlob); // Store for later upload
          };
          let uploadedBytes = 0;
          let v =0;
          for (let i = 0; i < encryptedChunks.length; i++) {
            const encryptedBlob = encryptedChunks[i];
            const encryptedSize = encryptedBlob.size;

            const contentRange = `bytes ${uploadedBytes}-${uploadedBytes + encryptedSize - 1}/${totalEncryptedSize}`;

            const chunkResponse = await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    'Content-Range': contentRange
                },
                body: await encryptedBlob.arrayBuffer()
            });
            const chunkResponseText = await chunkResponse.text(); // Get response text
            v = JSON.parse(chunkResponseText);

            if (!chunkResponse.ok) {
                throw new Error('Failed to upload chunk');
            }

            uploadedBytes += encryptedSize;
          };



          // let v = 0;
          // for (let i = 0; i < totalChunks; i++) {
          //     const start = i * chunkSize;
          //     const end = Math.min(start + chunkSize, file.size);
          //     const chunk = file.slice(start, end);
        
          //     // Encrypt chunk before uploading
          //     const encryptedChunk = await encryptFile(chunk, encryptionKey);
          //     const encryptedBlob = encryptedChunk.encryptedBlob;
          //     const encryptedSize = encryptedBlob.size;
    
          //     console.log(`Chunk ${i + 1}/${totalChunks} size: ${chunk.size} bytes`);
          //     console.log(`Chunk ${i + 1}/${totalChunks} offset: ${start}`);
          //     console.log('Chunk contents (Blob):', encryptedBlob);
          //     console.log(`Chunk ${i + 1}/${totalChunks} original size: ${chunk.size} bytes`);
          //     console.log(`Chunk ${i + 1}/${totalChunks} encrypted size: ${encryptedSize} bytes`);
            
          //     // Upload chunk
          //     const chunkResponse = await fetch(uploadUrl, {
          //         method: 'PUT',
          //         headers: {
          //             'Content-Range': `bytes ${start}-${start + encryptedSize - 1}/${file.size}`
          //         },
          //         body: await encryptedBlob.arrayBuffer()
          //     });
              
          //     const chunkResponseText = await chunkResponse.text(); // Get response text
          //     v = JSON.parse(chunkResponseText);
          //     console.log(JSON.parse(chunkResponseText));
          //     console.log(`Chunk ${i + 1} upload response:`, chunkResponseText);
              
          //     if (!chunkResponse.ok) {
          //         throw new Error('Failed to upload chunk');
          //     }
    
          //     console.log(`Chunk ${i + 1} uploaded successfully`);
          // }
    
          //Send metadata to your backend
          // const insertFileResponse = await fetch('https://cipherlink.xyz:5000/api/insert-file', {
          //     method: 'POST',
          //     headers: {
          //         'Content-Type': 'application/json'
          //     },
          //     body: JSON.stringify({
          //         filename: file.name,
          //         filelocation: "onedrive",
          //         itemid:v.id,
          //         filesize: file.size,
          //         uid: user.id, // Replace with the actual user ID if available
          //         keyId: keyId,
          //         filetype: file.type
          //     })
          // });
    
          // if (!insertFileResponse.ok) {
          //     throw new Error('Failed to insert file metadata');
          // }
    
          // const insertFileResult = await insertFileResponse.json();
          // console.log('Insert file response:', insertFileResult);
          try {
            // Log the data being sent in the request
            console.log('Data to be sent:', {
                filename: file.name,
                filelocation: "onedrive",
                itemid: v.id,
                filesize: file.size,
                uid: user.id, // Ensure this is defined
                keyId: keyId,
                filetype: file.type
            });
        
            // Make the POST request
            const insertFileResponse = await fetch('https://cipherlink.xyz:5000/api/insert-file', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    filename: file.name,
                    filelocation: "onedrive",
                    itemid: v.id,
                    filesize: file.size,
                    uid: user.id, // Replace with the actual user ID if available
                    keyId: keyId,
                    filetype: file.type
                })
            });
        
            // Log the status of the response
            console.log('Response status:', insertFileResponse.status);
        
            // Parse the response body
            const responseData = await insertFileResponse.json();
        
            // Log the response data
            console.log('Insert file response data:', responseData);
        
            if (!insertFileResponse.ok) {
                console.error('Failed to insert file metadata:', responseData);
                throw new Error(`Request failed with status ${insertFileResponse.status}`);
            }
          } catch (error) {
              // Log the error
              console.error('Error during file metadata insertion:', error);
          }
      } catch (error) {
          console.error('Error uploading file to OneDrive:', error);
      }
    }
    
    return (
      <div className="content-wrapper-small">
        <div className="main-content">
          <h2>{activeTab} Files</h2>
          <div className="upload-container" onDragOver={handleDragOver} onDrop={handleDrop}>
            <input type="file" id="file-upload" ref={fileInputRef} onChange={handleFileChange} />
            <label htmlFor="file-upload" className="upload-area">
              Select Files To Upload
            </label>
            <button className="upload-button" onClick={handleUpload} disabled={isLocked}>Upload</button>
            <button className="upload-button" onClick={splitFileAndUploadToOneDrive} >Upload Big File Test</button>
            <button className="refresh-button" onClick={handleRefresh}>Refresh</button>
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
              {/* Table content */}
            </tbody>
          </table>
          <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search your files..." 
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button>Search</button>
        </div>
        {(
          <div className="search-results">
          <h2>Search Results</h2>
          <table id="dynamic-searchtable">
            <thead>
              <tr>
                <th>File Name</th>
                <th>File Type</th>
                <th>File Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Table content */}
            </tbody>
          </table>
        </div>
        )}
        </div>
        
      </div>
    );
  };

  const handleAddTab = (tabName) => {
    // Set the maximum number of tabs based on plan ID
    let maxTabs;
    switch (plan) {
        case 1:
            maxTabs = 2; // Plan ID 1 allows only 2 tabs
            break;
        case 2:
            maxTabs = 4; // Plan ID 2 allows only 4 tabs
            break;
        case 3:
        default:
            maxTabs = Infinity; // Plan ID 3 has no restrictions
            break;
    }

    if (tabs.length >= maxTabs) {
        alert(`Your current plan only allows up to ${maxTabs} tabs.`);
        return;
    }

    if (tabs.includes(tabName)) {
        alert(`Tab for ${tabName} already exists.`);
        return;
    }

    // Add the new tab
    const updatedTabs = [...tabs, tabName];
    setTabs(updatedTabs);
    setActiveTab(tabName);

    // Connect to the respective cloud service based on the tab name
    if (tabName === 'Google Drive') {
        connectCloud();
    } else if (tabName === 'OneDrive') {
        connectOneDrive();
    } else if (tabName === 'Dropbox') {
        connectDB();
    }
  };

  
  const handleRemoveTab = (tabName) => {
    // Filter out the tab to be removed
    const updatedTabs = tabs.filter(tab => tab !== tabName);
  
    // Update the state with the new tabs array
    setTabs(updatedTabs);
  
    // Update localStorage with the new tabs array
    localStorage.setItem('tabs', JSON.stringify(updatedTabs));
  
    // Remove the corresponding token from localStorage
    if (tabName === 'Google Drive') {
      localStorage.removeItem('gdtoken');
    } else if (tabName === 'OneDrive') {
      localStorage.removeItem('odtoken');
    } else if (tabName === 'Dropbox') {
      localStorage.removeItem('dbtoken');
    }
  
    // Update the active tab if the removed tab was the active one
    if (activeTab === tabName) {
      setActiveTab(updatedTabs.length > 0 ? updatedTabs[0] : '');
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
  let maxTabs;
  const planid = user.planid; // Assume you have access to the user's plan ID
  console.log(planid);
  // Set the maximum number of tabs based on plan ID
  
  switch (planid) {
    case 1:
      maxTabs = 2; // Plan ID 1 allows only 2 tabs
      break;
    case 2:
      maxTabs = 4; // Plan ID 2 allows only 4 tabs
      break;
    case 3:
    default:
      maxTabs = Infinity; // Plan ID 3 has no restrictions
      break;
  }
  // const AddTabButton = ({ tabs, handleAddTab, user }) => {
  //   const planid = user.planid; // Assume you have access to the user's plan ID
  //   console.log(planid);
  //   // Set the maximum number of tabs based on plan ID
    
  //   switch (planid) {
  //     case 1:
  //       maxTabs = 2; // Plan ID 1 allows only 2 tabs
  //       break;
  //     case 2:
  //       maxTabs = 4; // Plan ID 2 allows only 4 tabs
  //       break;
  //     case 3:
  //     default:
  //       maxTabs = Infinity; // Plan ID 3 has no restrictions
  //       break;
  //   }

    // Disable button if the number of tabs has reached the maximum allowed
    
  //};
  const isDisabled = tabs.length >= maxTabs;

  return (
    <div className="user-dashboard">
      <Sidebar />
      <div className="main-content-user-dashboard">
        <header>
          <div className="welcome">
            <FaUser style={{ marginRight: '10px' }} />
            Welcome, {user.username}
          </div>
          {/* <div className="search-bar">
            <input type="text" placeholder="Search your files..." />
            <button>Search</button>
          </div> */}
          <div className="lock-toggle" onClick={handleLockToggle}>
            {isLocked ? <FaLock size={'1.3em'} /> : <FaUnlock size={'1.3em'} />}
          </div>
        </header>

        <div className="tabs">
          {tabs.map(tab => (
            <div key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`}>
              <button className={`tab-button ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
              <button className="remove-tab-button" onClick={() => handleRemoveTab(tab)}>x</button>
            </div>
          ))}
          <Popup trigger={<button className="add-tab-button" disabled={isDisabled}>+</button>} modal className="popup-modal">
            {close => (
              <div className="modal-container">
                <div className="modal">
                  <h3>Select Cloud Service</h3>
                  <button onClick={() => { handleAddTab('Google Drive'); close(); }}disabled={isDisabled}>Google Drive</button>
                  <button onClick={() => { handleAddTab('OneDrive'); close(); }}disabled={isDisabled}>OneDrive</button>
                  <button onClick={() => { handleAddTab('Dropbox'); close(); }}disabled={isDisabled}>Dropbox</button>
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
          <RightSidebar file={previewFile} />
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
    console.log(file); // Inspect the file object
    if (file && file.file) {
      // Check if file.file is a valid File or Blob object
      console.log(file.file instanceof Blob);
      if (file.file instanceof Blob) {
        const url = URL.createObjectURL(file.file);
        setFileUrl(url);
        return () => URL.revokeObjectURL(url);
      }
    }
  }, [file]);
  const renderFilePreview = () => {
    if (!fileUrl) return <p>No preview available</p>;

    switch (true) {
      case file.filetype.startsWith('image/'):
        return <img src={fileUrl} alt={file.filename} style={{ maxWidth: '100%' }} />;
      case file.filetype === 'application/pdf':
        return <iframe src={fileUrl} style={{ width: '100%', height: '500px' }} title={file.filename}></iframe>;
      case file.filetype === 'text/plain':
        return <iframe src={fileUrl} style={{ width: '100%', height: '500px' }} title={file.filename}></iframe>;
      default:
        return <p>Preview not supported for this file type.</p>;
    }
  };
  

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
      
        <>
          <ul>
            <li><strong>File Name:</strong> {file.filename}</li>
            <li><strong>File Type:</strong> {file.filetype}</li>
            <li><strong>File Size:</strong> {file.filesize}</li>
          </ul>
          <button className="preview-button" onClick={() => window.open(fileUrl, '_blank')}>Preview in New Tab</button>
          {/* <button className="download-button" onClick={handleDownload}>Download</button> */}
          {renderFilePreview()}
        </>
       
    </div>
  );
};

export default UserDashboard;
