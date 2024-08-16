import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { FaUsers } from "react-icons/fa";
import { LuActivitySquare } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { RiAdminFill } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Mapping plan IDs to their respective names
const planNames = {
  1: 'Basic',
  2: 'Silver',
  3: 'Gold'
};

const AdminDashboard = () => {
  const [user, setUser] = useState('');
  const [endUser, setEndUser] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query

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
        const response = await axios.get('https://cipherlink.xyz:5000/api/users');
        setEndUser(response.data);
      } catch (error) {
        console.error('Error fetching users: ', error);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleLogOut = () => {
    sessionStorage.clear();
  };

  const handleUpdateClick = (user) => {
    navigate('/adminupdateuser', { state: { user } });
  };

  const handleDelete = async (user) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      const userEmail = user.email; 
      if (!userEmail) {
          console.error('User email is undefined');
          return;
      }

      try {
          const response = await axios.delete(`https://cipherlink.xyz:5000/api/admin/${userEmail}`);
          
          if (response.status === 200) {
              console.log('User deleted:', userEmail);
              setEndUser((prevUsers) => prevUsers.filter((u) => u.email !== userEmail));
          } else {
              console.error('Failed to delete user');
          }
      } catch (error) {
        console.error('Error deleting user account:', error);
        alert('An error occurred while deleting this account. Please try again.');
    }
    }
  };

  // Function to filter users based on the search query
  const filteredUsers = endUser.filter((user) => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Link to="/login" onClick={handleLogOut}>
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
        <div className='main-content-usermanagement'>
          <section className="user-management">
            <h2>Users</h2>
            <Link to="/admincreateuser"><button className="create-user">Create User</button></Link>
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={index}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{planNames[user.planid]}</td>
                    <td>
                      <button className="updateuser" onClick={() => handleUpdateClick(user)}>Update</button>
                      <button className="deleteuser" onClick={() => handleDelete(user)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
        
      </div>
    </div>
  );
};

export default AdminDashboard;