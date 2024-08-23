import React, { useState, useEffect } from 'react';
import './SuperAdminDashboard.css';
import { FaUsers } from "react-icons/fa";
import { LuActivitySquare } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { GrUserAdmin } from "react-icons/gr";
import { RiAdminFill } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Define hardcoded assess rights
const assessRightsMapping = {
  1: 'Full Access',
  2: 'Read and Write',
  3: 'Read Only'
};

const SuperAdminDashboard = () => {
  const [user, setUser] = useState('');
  const [admin, setAdmin] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } else {
      navigate('/login');
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://cipherlink.xyz:5000/api/admins');
        setAdmin(response.data);
      } catch (error) {
        console.error('Error fetching users: ', error);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleUpdateClick = (admin) => {
    navigate('/superadminupdateadmin', { state: { admin } })
  };

  const handleDelete = async (admin) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      const adminEmail = admin.email; 
      if (!adminEmail) {
          console.error('Admin email is undefined');
          return;
      }

      try {
          const response = await axios.delete(`https://cipherlink.xyz:5000/api/admin/${adminEmail}`);
          
          if (response.status === 200) {
              console.log('Admin deleted:', adminEmail);
              setAdmin((prevAdmins) => prevAdmins.filter((u) => u.email !== adminEmail));
          } else {
              console.error('Failed to delete admin');
          }
      } catch (error) {
        console.error('Error deleting admin account:', error);
        alert('Unable to delete user. Files detected.');
    }
    }
  };

  const handleLogOut = () => {
    sessionStorage.clear();
  };

  // Function to filter users based on the search query
  const filteredAdmin = admin.filter((admin) => 
    admin.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Link to="/login" onClick={handleLogOut}>
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
          Welcome, {user.username}!
          </div>
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search by username/email..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
            <button>Search</button>
          </div>
        </header>
        <section className="admins-management">
          <h2>Admins</h2>
          <Link to="/superadmincreateadmin"><button className="create-admin">Create Admin</button></Link>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Assess Rights</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmin.map((admin, index) => (
                <tr key={index}>
                  <td>{admin.username}</td>
                  <td>{admin.email}</td>
                  <td>{assessRightsMapping[admin.assessrights] || ''}</td>
                  <td>
                    <button className="updateadmin" onClick={() => handleUpdateClick(admin)}>Update</button>
                    <button className="deleteadmin" onClick={() => handleDelete(admin)}>Delete</button>
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
