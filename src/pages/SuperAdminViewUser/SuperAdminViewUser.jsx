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
    { name: 'Bonnie Lee', phone: '88992348', email: 'bonnielee@gmail.com' },
    { name: 'John Mchizzle', phone: '98263592', email: 'johnmchizzle@gmail.com' },
    { name: 'Mary Law', phone: '87635412', email: 'marylaw@gmail.com' },
    { name: 'Chiaki Opal', phone: '98274015', email: 'chiakiopal@gmail.com' },
    { name: 'Anthony Chen', phone: '90274565', email: 'anthonychen@gmail.com' },
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
            <li className="superadminNotActive">
              <Link to="/superadminadminactivity">
                <LuActivitySquare style={{ marginRight: '10px' }} />
                Admins Activity Log
              </Link>
            </li>
            <li className="superadminNotActive">
              <Link to="/superadminuseractivity">
                <LuActivitySquare style={{ marginRight: '10px' }} />
                Users Activity Log
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
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.phone}</td>
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
