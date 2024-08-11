import React, { useState }  from 'react';
import './SuperAdminCreateAdmin.css';
import { FaUsers } from "react-icons/fa";
import { LuActivitySquare } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { GrUserAdmin } from "react-icons/gr";
import { RiAdminFill } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Define assess rights options
const assessRightsOptions = [
  { value: 1, label: 'Full Access' },
  { value: 2, label: 'Read and Write' },
  { value: 3, label: 'Read Only' }
];

const SuperAdminCreateAdmin = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [assessrights, setAssessRights] = useState('');

  const handleAssessRightsChange = (e) => {
    const selectedValue = parseInt(e.target.value, 10); // Convert the selected value to an integer
    setAssessRights(selectedValue);
  };

  const handleCreate = async () => {
    try {
      // Check if the email already exists
      const checkResponse = await axios.post('http://localhost:5000/api/checkExistence', {
        email 
      });

      if (checkResponse.data.exists) {
        alert('Email already registered.');
        return;
      }
  
      // Create the new user
      const createUserResponse = await axios.post('http://localhost:5000/api/superadmin/createAdmin', {
        username,
        email,
        password,
        role: 'admin', 
        assessrights
      });
  
      console.log('Admin created:', createUserResponse.data);
      alert("Admin created successfully!");
      navigate('/superadmindashboard/:username');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('An error occurred while creating the user. Please try again.');
    }
  };

  const handleLogOut = () => {
    sessionStorage.clear();
  };

  return (
    <div className="super-admin-create-admin">
      <div className="sidebar">
        <div className="logoSuperAdmin">
            <img src="/images/CipherLinkLogo.png" alt="CipherLink Logo Login" /> 
            <p>CipherLink Trusted Cloud</p>
        </div>
        <nav>
          <ul>
            <li className="superadminActive">
              <Link to="/superadmindashboard/:username">
              <RiAdminFill style={{ marginRight: '10px' }} />
              Admins
              </Link>
            </li>
            <li className="superadminNotActive">
              <Link to="/superadminviewuser">
              <FaUsers style={{ marginRight: '10px' }} />
              Users
              </Link>
            </li>
          </ul>
        </nav>
        <div className="settings-logout">
          <div className="superadminNotActive">
          <Link to="/superadminaccmanagement">
            <IoMdSettings style={{ marginRight: '10px' }} />
            Settings
          </Link>
          </div>
          <div className="superadminNotActive">
          <Link to="/login" onClick={handleLogOut}>
            <IoLogOut style={{ marginRight: '10px' }} />
            Logout
          </Link>
          </div>
        </div>
      </div>
      <div className="main-content-super-admin-create">
        <section className="superadmin-create-admin">
          <h2>Create Admin Account</h2>
          <form>
            <label>
              Username:
              <input
                type="text"
                name="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <label>
              Assess Rights:
              <select  className='assessrights'
                name="assessrights"
                value={assessrights}
                onChange={handleAssessRightsChange}
              >
                {assessRightsOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="form-buttons">
              <Link to="/superadmindashboard/:username"><button type="button" className="back">
                Back
              </button></Link>
              <button type="button" className="createadminaccount" onClick={handleCreate}>
                Create Account
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default SuperAdminCreateAdmin;
