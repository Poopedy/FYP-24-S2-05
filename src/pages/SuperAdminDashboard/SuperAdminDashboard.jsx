import React from 'react';
import './SuperAdminDashboard.css';
import { FaUsers } from "react-icons/fa";
import { LuActivitySquare } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { GrUserAdmin } from "react-icons/gr";
import { RiAdminFill } from "react-icons/ri";
import { Link } from 'react-router-dom';

const SuperAdminDashboard = () => {
  const admins = [
    { username: 'Lyney Hearth', email: 'lyneyhearth@gmail.com', assessrights: 'Read & Write' },
    { username: 'Allan Walker', email: 'allanwalker@gmail.com', assessrights: 'Read & Write' },
    { username: 'Luca Leon', email: 'lucaleon@gmail.com', assessrights: 'Read' },
    { username: 'Melony Owen', email: 'melonyowen@gmail.com', assessrights: 'Write' },
    { username: 'Yilin Yon', email: 'yilinyon@gmail.com', assessrights: 'Read & Write' },
  ];

  return (
    <div className="super-admin-dashboard">
      <div className="sidebar">
        <div className="logoSuperAdmin">
            <img src="/images/CipherLinkLogo.png" alt="CipherLink Logo Login" /> 
            <p>CipherLink Trusted Cloud</p>
        </div>
        <nav>
          <ul>
            <li className="superadminActive">
              <RiAdminFill style={{ marginRight: '10px' }} />
              Admins
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
      <div className="super-admin-main-content">
        <header>
          <div className="welcome">
          <GrUserAdmin style={{ marginRight: '10px' }} />
          Welcome, Super Admin
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Search your admins..." />
            <button>Search</button>
          </div>
        </header>
        <section className="admins-management">
          <h2>Admins</h2>
          <Link to="/superadmincreateadmin"><button className="create-admin">Create Admin</button></Link>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Assess Rights</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin, index) => (
                <tr key={index}>
                  <td>{admin.username}</td>
                  <td>{admin.email}</td>
                  <td>{admin.assessrights}</td>
                  <td>
                    <Link to="/superadminupdateadmin"><button className="updateadmin">Update</button></Link>
                    <button className="deleteadmin">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
