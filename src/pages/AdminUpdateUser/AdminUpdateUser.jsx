import React, { useState, useEffect } from 'react';
import './AdminUpdateUser.css';
import { FaUsers } from "react-icons/fa";
import { LuActivitySquare } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Mapping plan IDs to their respective names
const planNames = {
  1: 'Basic',
  2: 'Silver',
  3: 'Gold'
};

const AdminUpdateUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(location.state?.user || {});

  // Ensure the currentEmail is part of the user object
  useEffect(() => {
    if (!user.currentEmail && user.email) {
      setUser(prev => ({ ...prev, currentEmail: prev.email }));
    }
  }, [user.email]);  
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      // Send current email as part of URL and new username and email in the request body
      const response = await axios.post(`https://cipherlink.xyz:5000/api/admin/updateUser/${user.currentEmail}`, {
        username: user.username,
        email: user.email,
      });
      console.log('User updated:', response.data);
      // Navigate back to the dashboard or show a success message
      navigate('/admindashboard/:username');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert('The email is already in use by another account.');
      } else {
      console.error('Error updating user:', error);
      }
    }
  };
  

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      const userEmail = user.email; 
      if (!userEmail) {
          console.error('User email is undefined');
          return;
      }

      try {
          const response = await axios.delete(`https://cipherlink.xyz:5000/api/admin/${userEmail}`);
          
          if (response.status === 200) {
              console.log('User deleted:', userEmail);
              navigate('/admindashboard/:username');
          } else {
              console.error('Failed to delete user');
          }
      } catch (error) {
        console.error('Error deleting user account:', error);
        alert('An error occurred while deleting this account. Please try again.');
    }
    }
  };

  const handleLogOut = () => {
    sessionStorage.clear();
  };

  return (
    <div className="admin-update">
    <div className="sidebar">
      <div className="logoAdmin">
          <img src="/images/CipherLinkLogo.png" alt="CipherLink Logo Login" /> 
          <p>CipherLink Trusted Cloud</p>
      </div>
      <nav>
        <ul>
          <li className="adminActive">
          <Link to="/admindashboard/:username">
                <FaUsers style={{ marginRight: '10px' }} />
                Users
            </Link>
          </li>
        </ul>
      </nav>
      <div className="settings-logout">
        <div className="adminNotActive">
        <Link to="/adminaccmanagement">
        <IoMdSettings style={{ marginRight: '10px' }} />
        Settings
        </Link>
        </div>
        <div className="adminNotActive">
        <Link to="/login" onClick={handleLogOut}>
        <IoLogOut style={{ marginRight: '10px' }} />
        Logout
        </Link>
        </div>
      </div>
    </div>
    <div className="main-content-update">
        <section className="user-update">
          <h2>Update User Account</h2>
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
                readOnly
                defaultValue={planNames[user.planid]}
              />
            </label>
            <div className="form-buttons">
              <Link to="/admindashboard/:username"><button type="button" className="back">
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

export default AdminUpdateUser;
