import React, { useState, useEffect }  from 'react';
import './SuperAdminUpdateAdmin.css';
import { FaUsers } from "react-icons/fa";
import { LuActivitySquare } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { GrUserAdmin } from "react-icons/gr";
import { RiAdminFill } from "react-icons/ri";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Define assess rights options
const assessRightsOptions = [
  { value: 1, label: 'Full Access' },
  { value: 2, label: 'Read and Write' },
  { value: 3, label: 'Read Only' }
];

const SuperAdminUpdateAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(location.state?.admin || {});

  useEffect(() => {
    if (!admin.currentEmail && admin.email) {
      setAdmin(prev => ({ ...prev, currentEmail: prev.email }));
    }
  }, [admin.email]);  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prevAdmin) => ({
      ...prevAdmin,
      [name]: value,
    }));
  };

  const handleAssessRightsChange = (e) => {
    const selectedValue = parseInt(e.target.value, 10); // Convert the selected value to an integer
    setAdmin((prevAdmin) => ({
      ...prevAdmin,
      assessrights: selectedValue,
    }));
  };

  const handleUpdate = async () => {
    try {
        const updatedData = {
            username: admin.username,
            email: admin.email,
            assessrights: admin.assessrights
        };

        if (admin.password) {
            updatedData.password = admin.password;
        }

        console.log(updatedData);

        const response = await axios.put(`https://cipherlink.xyz:5000/api/superadmin/updateAdmin/${admin.currentEmail}`, {
            updatedData
        });

        console.log('Admin updated:', response.data);

        // Update local state with updated admin info
        const updatedAdmin = { ...admin, ...updatedData };
        setAdmin(updatedAdmin);
        alert('Admin updated successfully!');
        navigate('/superadmindashboard');
    } catch (error) {
        if (error.response && error.response.status === 409) {
            alert('The email is already in use by another account.');
        } else {
            console.error('Error updating admin details:', error);
            alert('An error occurred while updating the admin.');
        }
    }
};

  const handleDelete = async () => {
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
              navigate('/superadmindashboard');
          } else {
              console.error('Failed to delete admin');
          }
      } catch (error) {
        console.error('Error deleting admin account:', error);
        alert('An error occurred while deleting this account. Please try again.');
    }
    }
  };

  const handleLogOut = () => {
    sessionStorage.clear();
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
          <Link to="/login" onClick={handleLogOut}>
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
                type="text"
                name="username"
                defaultValue={admin.username}
                onChange={handleChange}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                defaultValue={admin.email}
                onChange={handleChange}
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                name="password"
                defaultValue=''
                onChange={handleChange}
              />
            </label>
            <label>
              Assess Rights:
              <select  className='assessrights'
                name="assessrights"
                value={admin.assessrights || ''}
                onChange={handleAssessRightsChange}
              >
                {assessRightsOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
