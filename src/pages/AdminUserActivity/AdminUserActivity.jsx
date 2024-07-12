import React from 'react';
import './AdminUserActivity.css';
import { FaUsers } from "react-icons/fa";
import { LuActivitySquare } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { RiAdminFill } from "react-icons/ri";
import { Link } from 'react-router-dom';

const AdminUserActivity = () => {
  return (
    <div className="admin-user-activity">
      <div className="sidebar">
        <div className="logoAdmin">
          <img src="/images/CipherLinkLogo.png" alt="CipherLink Logo Login" />
          <p>CipherLink Trusted Cloud</p>
        </div>
        <nav>
          <ul>
            <li className="adminNotActive">
              <Link to="/admindashboard">
              <FaUsers style={{ marginRight: '10px' }} />
              Users
              </Link>
            </li>
            <li className="adminActive">
                <LuActivitySquare style={{ marginRight: '10px' }} />
                Users Activity Log
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
      <div className="main-content-admin-user-activity">
        <section className="admin-user-act">
          <h2>Users Activity Log</h2>
          <div className="form-buttons">
            <Link to="/admindashboard"><button type="button" className="back">
              Back
            </button></Link>
          </div>
          <div className="content-container">
            <div className="user-activity-chart">
              <img src="/images/ActivityChart.png" alt="User Activity Chart" />
            </div>
            <div className="admin-user-last-accessed">
                <p>Last accessed on: ...</p>
                <ul>
                  <li>Bonnie uploaded file on Google Drive</li>
                  <li>Chiaki downloaded file</li>
                  <li>Anthony assessed their settings</li>
                  <li>Anthony updated...</li>
                  <li>John upgraded to Premium package</li>
                  <li>Mary uploaded file on OneDrive</li>
                </ul>
              </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminUserActivity;
