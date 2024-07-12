import React, { useState } from 'react';
import './UserAccountManagement.css';
import { FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { LuActivitySquare } from "react-icons/lu";
import { PiFilesFill } from "react-icons/pi";
import { HiSparkles } from "react-icons/hi2";
import { Link } from 'react-router-dom';

const UserAccountManagement = () => {
  const [user, setUser] = useState({
    name: 'John Mchizzle',
    phone: '97864722',
    email: 'mchizzle@gmail.com',
    password: '***********',
    package: 'Freenium',
    userkey: 'vd8*******'
  });

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
            <li className="userNotActive">
            <Link to="/useractivitybilling">
                <LuActivitySquare style={{ marginRight: '10px' }} />
                Activity Log & Billing
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
              Name:
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
              />
            </label>
            <label>
              Phone:
              <input
                type="text"
                name="phone"
                value={user.phone}
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
              Package:
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
