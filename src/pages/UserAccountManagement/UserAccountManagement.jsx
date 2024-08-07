import React, { useState } from 'react';
import './UserAccountManagement.css';
import { FaUser, FaLock, FaUnlock } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { PiFilesFill } from "react-icons/pi";
import { HiSparkles } from "react-icons/hi2";
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const UserAccountManagement = () => {
  const [user, setUser] = useState({
    name: 'John Mchizzle',
    phone: '97864722',
    email: 'mchizzle@gmail.com',
    password: '***********',
    package: 'Gold',
    userkey: 'vd8*******'
  });

  const [isLocked, setIsLocked] = useState(true);
  const [showPassphrasePopup, setShowPassphrasePopup] = useState(false);
  const [inputPassphrase, setInputPassphrase] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    // Handle update logic
    console.log('User updated:', user);
  };

  const handleDelete = () => {
    // Handle delete logic
    console.log('User deleted');
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
      <div className="main-content-managment">
        <section className="user-management">
          <h2>Account Details</h2>
          <form>
            <label>
              Username:
              <input
                type="username"
                name="username"
                value={user.name}
                onChange={handleChange}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
              />
            </label>
            <label>
              Password:
              <input
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  readOnly={isLocked}
                  className={isLocked ? 'locked' : ''}
              />
              <button type="button" className="lock-button" onClick={handleLockToggle}>
                {isLocked ? <FaLock /> : <FaUnlock />}
              </button>
            </label>
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
            <label>
              Plan:
              <input
                type="package"
                name="package"
                value={user.package} readOnly
                onChange={handleChange}
                className='input-readOnly'
              />
              <Link to="/usercloudserviceupgrade"><button type="button" className="upgrade-account">
                Upgrade
              </button></Link>
            </label>
            <label className="userkey-label">
              User Key:
              <select
                name="userkey"
                value={user.userkey}
                onChange={handleChange}
                className="userkey-dropdown"
              >
                <option value="userkey1">vd8*******</option>
                <option value="userkey2">m2g*******</option>
              </select>
            </label>
            <div className="form-buttons">
              <Link to="/userdashboard"><button type="button" className="back">
                Back
              </button></Link>
              <button type="button" className="updateaccount" onClick={handleUpdate}>
                Update Account
              </button>
            </div>
          </form>
          <button type="button" className="deleteaccount" onClick={handleDelete}>
            Delete Account
          </button>
        </section>
      </div>
    </div>
  );
};

export default UserAccountManagement;
