import React, { useState }  from 'react';
import './SuperAdminCreateAdmin.css';
import { FaUsers } from "react-icons/fa";
import { LuActivitySquare } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { GrUserAdmin } from "react-icons/gr";
import { RiAdminFill } from "react-icons/ri";
import { Link } from 'react-router-dom';

const SuperAdminCreateAdmin = () => {
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
          <div className="superadminNotActive">
          <Link to="/superadminaccmanagement">
            <IoMdSettings style={{ marginRight: '10px' }} />
            Settings
          </Link>
          </div>
          <div className="superadminNotActive">
          <Link to="/login">
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
                type="username"
                name="username"
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
            <label>
              Assess Rights:
              <input
                type="text"
                name="assessrights"
              />
            </label>
            <div className="form-buttons">
              <Link to="/superadmindashboard"><button type="button" className="back">
                Back
              </button></Link>
              <button type="button" className="createadminaccount">
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
