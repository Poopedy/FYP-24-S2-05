import React, { useState } from 'react';
import './UserGenerateKey.css';
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { PiFilesFill } from "react-icons/pi";
import { HiSparkles } from "react-icons/hi2";
import { FaKey } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const UserGenerateKey = () => {
  const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const [encryptionKey, setEncryptionKey] = useState('');

  const handleGenerateClick = (event) => {
    event.preventDefault();
    const newKey = generateRandomString(16);
    setEncryptionKey(newKey);
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
            <Link to="/login">
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
              <button className="Generate" onClick={handleGenerateClick}>Generate</button>
              <Link to="/useraccmanagement">
                <button className="Proceed" type="submit">Proceed</button>
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
