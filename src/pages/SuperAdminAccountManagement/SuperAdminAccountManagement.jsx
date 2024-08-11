import React, { useState }  from 'react';
import './SuperAdminAccountManagement.css';
import { FaUsers } from "react-icons/fa";
import { LuActivitySquare } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { GrUserAdmin } from "react-icons/gr";
import { RiAdminFill } from "react-icons/ri";
import { Link } from 'react-router-dom';

const SuperAdminAccountManagement = () => {
  const [superAdmin, setSuperAdmin] = useState({
    username: 'Connor Chew',
    email: 'connorchew@gmail.com',
    password: '***********',
  });

  const handleChange = (e) => {
    const { username, value } = e.target;
    setSuperAdmin((prevSuperAdmin) => ({
      ...prevSuperAdmin,
      [username]: value,
    }));
  };

  const handleUpdate = () => {
    // Handle update logic
    console.log('Super Admin updated:', admin);
  };

  const handleDelete = () => {
    // Handle delete logic
    console.log('Super Admin deleted');
  };

  return (
    <div className="super-admin-account-management">
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
            <li className="superadminNotActive">
              <Link to="/superadminviewuser">
              <FaUsers style={{ marginRight: '10px' }} />
              Users
              </Link>
            </li>
          </ul>
        </nav>
        <div className="settings-logout">
          <div className="superadminActive">
            <IoMdSettings style={{ marginRight: '10px' }} />
            Settings
          </div>
          <div className="superadminNotActive">
          <Link to="/login">
            <IoLogOut style={{ marginRight: '10px' }} />
            Logout
          </Link>
          </div>
        </div>
      </div>
      <div className="main-content-super-admin-management">
        <section className="super-admin-setting-management">
        <h2>Account Details</h2>
          <form>
            <label>
              Username:
              <input
                type="username"
                name="username"
                value={superAdmin.username}
                onChange={handleChange}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={superAdmin.email}
                onChange={handleChange}
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                name="password"
                value={superAdmin.password}
                onChange={handleChange}
              />
            </label>
            <div className="form-buttons">
              <Link to="/superadmindashboard"><button type="button" className="back">
                Back
              </button></Link>
              <button type="button" className="superadminupdateaccount" onClick={handleUpdate}>
                Update Account
              </button>
            </div>
          </form>
          <button type="button" className="superadmindeleteaccount" onClick={handleDelete}>
            Delete Account
          </button>
        </section>
      </div>
    </div>
  );
};

export default SuperAdminAccountManagement;
