import React, { useState, useEffect } from 'react';
import './AdminAccountManagement.css';
import { FaUsers } from "react-icons/fa";
import { LuActivitySquare } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { RiAdminFill } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const assessRightsNames = {
  1: 'Full Access',
  2: 'Read and Write',
  3: 'Read Only',
};

const AdminAccountManagement = () => {
  const [user, setUser] = useState({
    id: '',
    username: '',
    email: '',
    password: '',
    assessrights: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        try {
          // Make a request to get the assess rights from the backend
          const response = await axios.post('https://cipherlink.xyz:5000/api/getAssessRights', {
            email: parsedUser.email
          });

          const assessRightsValue = response.data.assessrights;
          console.log(assessRightsValue);
          // Check if assessRightsValue is valid and set it
          if (assessRightsValue && assessRightsNames[assessRightsValue]) {
            parsedUser.assessrights = assessRightsNames[assessRightsValue]; // Map the numeric value to the corresponding string
          } else {
            parsedUser.assessrights = ''; // Default to empty if not valid
          }

          setUser(parsedUser);
        } catch (error) {
          console.error('Error fetching assess rights:', error);
        }
      } else {
        navigate('/login');
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevAdmin) => ({
      ...prevAdmin,
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

      const response = await axios.put(`https://cipherlink.xyz:5000/api/updateAccount/${user.id}`, {
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
        const response = await axios.post('https://cipherlink.xyz:5000/api/deleteAccount', {
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

  const handleLogOut = () => {
    sessionStorage.clear();
  }

  return (
    <div className="admin-account-management">
      <div className="sidebar">
        <div className="logoAdmin">
          <img src="/images/CipherLinkLogo.png" alt="CipherLink Logo Login" />
          <p>CipherLink Trusted Cloud</p>
        </div>
        <nav>
          <ul>
            <li className="adminNotActive">
              <Link to="/admindashboard">
                <FaUsers style={{ marginRight: '10px' }} />
                Users
              </Link>
            </li>
          </ul>
        </nav>
        <div className="settings-logout">
          <div className="adminActive">
            <IoMdSettings style={{ marginRight: '10px' }} />
            Settings
          </div>
          <div className="adminNotActive">
            <Link to="/login" onClick={handleLogOut}>
              <IoLogOut style={{ marginRight: '10px' }} />
              Logout
            </Link>
          </div>
        </div>
      </div>
      <div className="main-content-admin-managment">
        <section className="admin-setting-management">
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
              Password:
              <input
                type="password"
                name="password"
                defaultValue={user.password}
                onChange={handleChange}
              />
            </label>
            <label>
              Assess Rights:
              <input
                type="text"
                name="assessrights"
                value={user.assessrights} readOnly
                onChange={handleChange}
                className='input-readOnly'
              />
            </label>
            <div className="form-buttons">
              <Link to="/admindashboard"><button type="button" className="back">
                Back
              </button></Link>
              <button type="button" className="adminupdateaccount" onClick={handleUpdate}>
                Update Account
              </button>
            </div>
          </form>
          <button type="button" className="admindeleteaccount" onClick={handleDelete}>
            Delete Account
          </button>
        </section>
      </div>
    </div>
  );
};

export default AdminAccountManagement;
