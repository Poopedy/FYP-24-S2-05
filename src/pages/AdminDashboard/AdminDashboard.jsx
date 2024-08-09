import React from 'react';
import './AdminDashboard.css';
import { FaUsers } from "react-icons/fa";
import { LuActivitySquare } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { RiAdminFill } from "react-icons/ri";
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const users = [
    { name: 'Bonnie Lee', phone: '88992348', email: 'bonnielee@gmail.com' },
    { name: 'John Mchizzle', phone: '98263592', email: 'johnmchizzle@gmail.com' },
    { name: 'Mary Law', phone: '87635412', email: 'marylaw@gmail.com' },
    { name: 'Chiaki Opal', phone: '98274015', email: 'chiakiopal@gmail.com' },
    { name: 'Anthony Chen', phone: '90274565', email: 'anthonychen@gmail.com' },
  ];

  return (
    <div className="admin-dashboard">
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
      <div className="main-content">
        <header>
          <div className="welcome">
          <RiAdminFill style={{ marginRight: '10px' }} />
          Welcome, Admin
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Search your users..." />
            <button>Search</button>
          </div>
        </header>
        <section className="user-management">
          <h2>Users</h2>
          <Link to="/admincreateuser"><button className="create-user">Create User</button></Link>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Plan</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.planid}</td>
                  <td>
                    <Link to="/adminupdateuser"><button className="updateuser">Update</button></Link>
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

export default AdminDashboard;
