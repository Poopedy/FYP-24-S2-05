import React, { useState } from 'react';
import './AdminCreateUser.css';
import { FaUsers } from "react-icons/fa";
import { LuActivitySquare } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { Link } from 'react-router-dom';

const AdminCreateUser = () => {
  return (
    <div className="admin-create">
    <div className="sidebar">
      <div className="logoAdmin">
          <img src="/images/CipherLinkLogo.png" alt="CipherLink Logo Login" /> 
          <p>CipherLink Trusted Cloud</p>
      </div>
      <nav>
        <ul>
            <li className="adminActive">
            <FaUsers style={{ marginRight: '10px' }} />
            Users</li>
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
    <div className="main-content-create">
        <section className="admin-create-user">
          <h2>Create User Account</h2>
          <form>
            <label>
              Name:
              <input
                type="text"
                name="name"
              />
            </label>
            <label>
              Phone:
              <input
                type="text"
                name="phone"
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                name="password"
              />
            </label>
            <div className="form-buttons">
              <Link to="/admindashboard/:username"><button type="button" className="back">
                Back
              </button></Link>
              <button type="button" className="createaccount">
                Create Account
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default AdminCreateUser;
