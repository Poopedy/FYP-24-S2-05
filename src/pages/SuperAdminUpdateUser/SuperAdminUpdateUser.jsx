import React, { useState }  from 'react';
import './SuperAdminUpdateUser.css';
import { FaUsers } from "react-icons/fa";
import { LuActivitySquare } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { GrUserAdmin } from "react-icons/gr";
import { RiAdminFill } from "react-icons/ri";
import { Link } from 'react-router-dom';

const SuperAdminUpdateUser = () => {
  const [user, setUser] = useState({
    username: 'Bonnie Lee',
    email: 'bonnielee@gmail.com',
    password: '***********',
  });

  const handleChange = (e) => {
    const { username, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [username]: value,
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
    <div className="super-admin-update-user">
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
      <div className="super-admin-update-user-main-content">
        <section className="users-update">
        <h2>Update User Account</h2>
          <form>
            <label>
              Username:
              <input
                type="username"
                name="username"
                value={user.username}
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
            <div className="form-buttons">
              <Link to="/superadminviewuser"><button type="button" className="back">
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

export default SuperAdminUpdateUser;
