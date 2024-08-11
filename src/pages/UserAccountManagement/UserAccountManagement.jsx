import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserAccountManagement.css';
import { FaUser, FaLock, FaUnlock } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { PiFilesFill } from "react-icons/pi";
import { HiSparkles } from "react-icons/hi2";
import { Link, useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

// Mapping plan IDs to their respective names
const planNames = {
  1: 'Basic',
  2: 'Silver',
  3: 'Gold'
};

const UserAccountManagement = () => {
  const [planid, setPlanid] = useState(null);
  const [plan, setPlan] = useState({ name: '', price: 0, status: 'Inactive' });
  const [user, setUser] = useState({ id: '', username: '', email: '', password: '', planid: '' });
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user data from sessionStorage
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setPlanid(parsedUser.planid);
    } else {
      navigate('/login');
    }
  }, []); // Run only once to initialize planid

  useEffect(() => {
    const fetchPlan = async () => {
      if (!planid) return; // Do nothing if planid is not set

      try {
        const response = await axios.post('http://localhost:5000/api/getplan', { planid });
        const fetchedPlan = response.data;
        fetchedPlan.name = planNames[planid]; // Set the plan name using the mapping
        setPlan(fetchedPlan);
      } catch (error) {
        console.error('Error fetching plan details:', error);
      }
    };

    fetchPlan();
  }, [planid]); // Run whenever planid changes

  const [isLocked, setIsLocked] = useState(true);
  const [showPassphrasePopup, setShowPassphrasePopup] = useState(false);
  const [inputPassphrase, setInputPassphrase] = useState('');
  const [isPassphraseCorrect, setIsPassphraseCorrect] = useState(false);

  const handleChange = (e) => {
    const { username, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [username]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const updatedData = {
          username: user.username,
          email: user.email,
      };

      if (user.password) {  // Only add the password if it was changed
          updatedData.password = user.password;
      }

      const response = await axios.put(`http://localhost:5000/api/updateAccount/${user.id}`, {
        updatedData
      });

      console.log('User updated:', response.data);
      // Create an updated user object excluding the password
      const updatedUser = { ...user, ...updatedData };
      delete updatedUser.password; // Exclude password from session storage

      // Update session storage with the new user data
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update local state
      setUser(updatedUser);
      alert('User updated successfully!');
  } catch (error) {
      if (error.response && error.response.status === 409) {
          alert('The email is already in use by another account.');
      } else {
          console.error('Error updating user details:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
        try {
            const response = await axios.post('http://localhost:5000/api/deleteAccount', {
                email: user.email 
            });

            console.log(response.data.message);

            // Clear session storage
            sessionStorage.clear();

            // Redirect to login page
            navigate('/login');

        } catch (error) {
            console.error('Error deleting user account:', error);
            alert('An error occurred while deleting your account. Please try again.');
        }
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
      const response = await axios.post('http://localhost:5000/api/validatePassphrase', {
          userId: user.id,
          inputPassphrase: inputPassphrase
      });

      if (response.data.message === 'Passphrase is valid') {
        setIsPassphraseCorrect(true);
        setIsLocked(false);
        setShowPassphrasePopup(false);
        setInputPassphrase('');  // Clear the passphrase input
      }
    } catch (error) {
      console.error('Failed to get user\'s passphrase', error);
      alert("Invalid Passphrase. Please try again.")
    }

  };

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
      <div className="main-content-managment">
        <section className="user-management">
          <h2>Account Details</h2>
          <form>
            <label>
              Username:
              <input
                type="text"
                name="username"
                defaultValue={user.username}
                onChange={handleChange}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                defaultValue={user.email}
                onChange={handleChange}
              />
            </label>
            <label>
              Plan:
              <input
                type="plan"
                name="plan"
                defaultValue={plan.name}
                readOnly
                className='input-readOnly'
              />
              <Link to="/usercloudserviceupgrade"><button type="button" className="upgrade-account">
                Upgrade
              </button></Link>
            </label>
            <label>
              Password:
              <input
                  type="password"
                  name="password"
                  defaultValue={user.password}
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
                    <input 
                      type="password" 
                      value={inputPassphrase} 
                      onChange={(e) => setInputPassphrase(e.target.value)} 
                    />
                    <button onClick={handlePassphraseSubmit}>Submit</button>
                    <button onClick={() => setShowPassphrasePopup(false)}>Cancel</button>
                  </div>
                </div>
              </Popup>
            )}
            <label className="userkey-label">
              User Key:
              <Link to={isPassphraseCorrect ? "/usergeneratekey" : "#"}>
                <button 
                  type="button" 
                  className={`generate-key ${!isPassphraseCorrect ? 'disabled-button' : ''}`}  
                  disabled={!isPassphraseCorrect}
                >
                  Change Encryption Key
                </button>
              </Link>
            </label>
            <div className="form-buttons">
              <Link to="/userdashboard">
                <button type="button" className="back">
                  Back
                </button>
              </Link>
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
