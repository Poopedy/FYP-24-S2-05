import React from 'react';
import './SuperAdminViewUser.css';
import { FaUsers } from "react-icons/fa";
import { LuActivitySquare } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { GrUserAdmin } from "react-icons/gr";
import { RiAdminFill } from "react-icons/ri";
import { Link } from 'react-router-dom';

const SuperAdminViewUser = () => {
  const users = [
    { username: 'Bonnie Lee', email: 'bonnielee@gmail.com' },
    { username: 'John Mchizzle', email: 'johnmchizzle@gmail.com' },
    { username: 'Mary Law', email: 'marylaw@gmail.com' },
    { username: 'Chiaki Opal', email: 'chiakiopal@gmail.com' },
    { username: 'Anthony Chen', email: 'anthonychen@gmail.com' },
  ];

  return (
    <div className="super-admin-view-users">
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
            <input type="text" placeholder="Search your users..." />
            <button>Search</button>
          </div>
        </header>
        <section className="super-admin-user-management">
          <h2>Users</h2>
          <Link to="/superadmincreateuser"><button className="create-user">Create User</button></Link>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <Link to="/superadminupdateuser"><button className="updateuser">Update</button></Link>
                    <button className="deleteuser">Delete</button>
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

export default SuperAdminViewUser;
