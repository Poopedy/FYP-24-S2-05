import React, { useState, useEffect } from 'react';
import './UserGenerateKey.css';
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { PiFilesFill } from "react-icons/pi";
import { HiSparkles } from "react-icons/hi2";
import { FaKey } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { generate256BitKey } from '../../../utilities/clientKeyUtilities';
import { encryptWithPassphrase } from '../../../models/encryptionModel';
import axios from 'axios';

const UserGenerateKey = () => {
  const [user, setUser] = useState({ id: '', username: '', email: '' });
  // State to store the generated key
  const [encryptionKey, setEncryptionKey] = useState('');
  // State to store passphrase
  const [passphrase, setPassphrase] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user data from sessionStorage
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Check session storage for passphrase
      const storedData = sessionStorage.getItem('passphraseData');

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setPassphrase(parsedData.passphrase);
      } else {
        const fetchPassphrase = async () => {
          try {
            const response = await axios.get(`http://localhost:5000/api/passphrase/${user.id}`);
            if (response.data.passphrase) {
              setPassphrase(response.data.passphrase);
            } else {
              console.error('Passphrase not found in response: ', response.data);
            }
          } catch (error) {
            console.error('Error fetching passphrase: ', error);
          }
        };

        fetchPassphrase();
      }
    } else {
      console.error('No userId found in session storage');
      navigate('/login');
    }
  }, []);

  // Handler to generate a new key when the button is clicked
  const handleGenerateClick = async (event) => {
    event.preventDefault(); // Prevent form submission
    const newKey = await generate256BitKey();
    const keyBuffer = await window.crypto.subtle.exportKey('raw', newKey);
    const keyArray = new Uint8Array(keyBuffer);
    const keyString = keyArray.slice(0, 6).reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
    setEncryptionKey(keyString);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user.id) {
        throw new Error('User ID not found');
      }

      // Encrypt encryption key with passphrase
      const encryptedData = await encryptWithPassphrase(encryptionKey, passphrase);
      const encryptedKeyString = btoa(String.fromCharCode(...new Uint8Array(encryptedData)));

      await axios.post('http://localhost:5000/api/keys', {
        userId: user.id,
        encryptedKey: encryptedKeyString
      });

      navigate('/useraccmanagement')

    } catch (error) {
      console.error('Update failed', error);
    }

  }

  const handleLogOut = () => {
    sessionStorage.clear();
  };

  return (
    <div className="user-account-management">
      <div className="sidebar">
        <div className="logoUser">
          <img src="/images/CipherLinkLogo.png" alt="CipherLink Logo Login" />
          <p>CipherLink Trusted Cloud</p>
        </div>
        <nav>
          <ul>
            <li className="userNotActive">
              <Link to="/userdashboard">
                <PiFilesFill style={{ marginRight: '10px' }} />
                My Files
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
          <div className="userActive">
            <IoMdSettings style={{ marginRight: '10px' }} />
            Settings
          </div>
          <div className="userNotActive">
            <Link to="/login" onClick={handleLogOut}>
              <IoLogOut style={{ marginRight: '10px' }} />
              Logout
            </Link>
          </div>
        </div>
      </div>
      <div className="main-content-generate">
        <section className="user-key-generation">
          <div className="key-wrapper">
            <form action="">
              <h1>Generate Encryption Key</h1>
              <p>Encrypt your files with CipherLink!</p>
              <div className="input-box">
                <input type="text" value={encryptionKey} readOnly />
                <FaKey className='icon' />
              </div>
              <button className="usergenerate" onClick={handleGenerateClick}>Generate</button>
              <Link to="/useraccmanagement">
                <button className="Proceed" type="submit" onClick={handleSubmit}>Proceed</button>
              </Link>
            </form>
          </div>
          <div className="generate-back">
              <Link to="/useraccmanagement"><button type="button" className="back-generate">
                Back
              </button></Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserGenerateKey;