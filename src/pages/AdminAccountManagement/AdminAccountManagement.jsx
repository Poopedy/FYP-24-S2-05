import React, { useState } from 'react';
import './AdminAccountManagement.css';
import { FaUsers } from "react-icons/fa";
import { LuActivitySquare } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { RiAdminFill } from "react-icons/ri";
import { Link } from 'react-router-dom';

const AdminAccountManagement = () => {
  const [user, setAdmin] = useState({
    username: 'Lyney Hearth',
    email: 'lyneyhearth@gmail.com',
    password: '***********',
    assessrights: 'Read & Write',
  });

  const handleChange = (e) => {
    const { username, value } = e.target;
    setAdmin((prevAdmin) => ({
      ...prevAdmin,
      [username]: value,
    }));
  };

  const handleUpdate = () => {
    // Handle update logic
    console.log('Admin updated:', user);
  };

  const handleDelete = () => {
    // Handle delete logic
    console.log('Admin deleted');
  };

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
            <Link to="/login">
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
                type="username"
                name="username"
                value={user.username}
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
              />
            </label>
            <label>
              Assess Rights:
              <input
                type="assessrights"
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
