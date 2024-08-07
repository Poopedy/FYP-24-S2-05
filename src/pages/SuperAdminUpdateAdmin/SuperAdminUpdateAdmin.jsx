import React, { useState }  from 'react';
import './SuperAdminUpdateAdmin.css';
import { FaUsers } from "react-icons/fa";
import { LuActivitySquare } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { GrUserAdmin } from "react-icons/gr";
import { RiAdminFill } from "react-icons/ri";
import { Link } from 'react-router-dom';

const SuperAdminUpdateAdmin = () => {
  const [admin, setAdmin] = useState({
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
    console.log('Admin updated:', admin);
  };

  const handleDelete = () => {
    // Handle delete logic
    console.log('Admin deleted');
  };

  return (
    <div className="super-admin-update">
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
      <div className="super-admin-update-admin-main-content">
        <section className="admins-update">
        <h2>Update Admin Account</h2>
          <form>
            <label>
              Username:
              <input
                type="username"
                name="username"
                value={admin.username}
                onChange={handleChange}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={admin.email}
                onChange={handleChange}
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                name="password"
                value={admin.password}
                onChange={handleChange}
              />
            </label>
            <label>
              Assess Rights:
              <input
                type="text"
                name="assassrights"
                value={admin.assessrights}
                onChange={handleChange}
              />
            </label>
            <div className="form-buttons">
              <Link to="/superadmindashboard"><button type="button" className="back">
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

export default SuperAdminUpdateAdmin;
