import React, { useState }  from 'react';
import './SuperAdminCreateUser.css';
import { FaUsers } from "react-icons/fa";
import { LuActivitySquare } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { GrUserAdmin } from "react-icons/gr";
import { RiAdminFill } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SuperAdminCreateUser = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogOut = () => {
    sessionStorage.clear();
  };

  const handleCreate = async () => {
    try {
      // Check if the email already exists
      const checkResponse = await axios.post('https://cipherlink.xyz:5000/api/checkExistence', {
        email 
      });

      if (checkResponse.data.exists) {
        alert('Email already registered.');
        return;
      }
  
      // Create the new user
      const createUserResponse = await axios.post('https://cipherlink.xyz:5000/api/admin/createUser', {
        username,
        email,
        password,
        role: 'user', 
        planid: 1
      });
  
      console.log('User created:', createUserResponse.data);
      alert("User created successfully!");
      navigate('//superadminviewuser');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('An error occurred while creating the user. Please try again.');
    }
  };

  return (
    <div className="super-admin-create-user">
      <div className="sidebar">
        <div className="logoSuperAdmin">
            <img src="/images/CipherLinkLogo.png" alt="CipherLink Logo Login" /> 
            <p>CipherLink Trusted Cloud</p>
        </div>
        <nav>
          <ul>
            <li className="superadminNotActive">
              <Link to="/superadmindashboard">
              <RiAdminFill style={{ marginRight: '10px' }} />
              Admins
              </Link>
            </li>
            <li className="superadminActive">
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
      <div className="main-content-super-admin-create-user">
        <section className="superadmin-create-user">
          <h2>Create User Account</h2>
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
            <div className="form-buttons">
              <Link to="/superadminviewuser"><button type="button" className="back">
                Back
              </button></Link>
              <button type="button" className="createaccount" onClick={handleCreate}>
                Create Account
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default SuperAdminCreateUser;
