import React, { useState } from 'react';
import './AdminUpdateUser.css';
import { FaUsers } from "react-icons/fa";
import { LuActivitySquare } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { Link } from 'react-router-dom';

const AdminUpdateUser = () => {
  const [user, setUser] = useState({
    name: 'Bonnie Lee',
    phone: '88992348',
    email: 'bonnielee@gmail.com',
    password: '***********',
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
    <div className="admin-update">
    <div className="sidebar">
      <div className="logoAdmin">
          <img src="/images/CipherLinkLogo.png" alt="CipherLink Logo Login" /> 
          <p>CipherLink Trusted Cloud</p>
      </div>
      <nav>
        <ul>
          <li className="adminActive">
          <FaUsers style={{ marginRight: '10px' }} />
          Users
          </li>
          <li className="adminNotActive">
          <Link to="/adminuseractivity">
          <LuActivitySquare style={{ marginRight: '10px' }} />
          Users Activity Log</Link>
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
        <Link to="/login">
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
            <div className="form-buttons">
              <Link to="/admindashboard"><button type="button" className="back">
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
