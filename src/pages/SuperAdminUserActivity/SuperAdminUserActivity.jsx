import React from 'react';
import './SuperAdminUserActivity.css';
import { FaUsers } from "react-icons/fa";
import { LuActivitySquare } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { GrUserAdmin } from "react-icons/gr";
import { RiAdminFill } from "react-icons/ri";
import { Link } from 'react-router-dom';

const SuperAdminUserActivity = () => {
  return (
    <div className="super-admin-user-activity">
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
            <li className="superadminNotActive">
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
            <li className="superadminActive">
                <LuActivitySquare style={{ marginRight: '10px' }} />
                Users Activity Log
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
      <div className="main-content-super-admin-user-activity">
        <section className="super-admin-user-act">
          <h2>Users Activity Log</h2>
          <div className="form-buttons">
            <Link to="/superadmindashboard"><button type="button" className="back">
              Back
            </button></Link>
          </div>
          <div className="content-container">
            <div className="user-activity-chart">
              <img src="/images/ActivityChart.png" alt="User Activity Chart" />
            </div>
            <div className="user-last-accessed">
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

export default SuperAdminUserActivity;
