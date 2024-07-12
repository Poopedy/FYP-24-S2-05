import React from 'react';
import './SuperAdminAdminActivity.css';
import { FaUsers } from "react-icons/fa";
import { LuActivitySquare } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { GrUserAdmin } from "react-icons/gr";
import { RiAdminFill } from "react-icons/ri";
import { Link } from 'react-router-dom';

const SuperAdminAdminActivity = () => {
  return (
    <div className="super-admin-admin-activity">
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
            <li className="superadminActive">
                <LuActivitySquare style={{ marginRight: '10px' }} />
                Admins Activity Log
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
      <div className="main-content-super-admin-admin-activity">
        <section className="super-admin-admin-act">
          <h2>Admins Activity Log</h2>
          <div className="form-buttons">
            <Link to="/superadmindashboard"><button type="button" className="back">
              Back
            </button></Link>
          </div>
          <div className="content-container">
            <div className="admin-activity-chart">
              <img src="/images/AdminActivityChart.png" alt="Admin Activity Chart" />
            </div>
            <div className="admin-last-accessed">
                <p>Last accessed on: ...</p>
                <ul>
                  <li>Lyney created user, Melony</li>
                  <li>Lyney updated Melony, email</li>
                  <li>Luca assessed their settings</li>
                  <li>Allan updated Chiaki, password</li>
                  <li>Allan created admin, Yilin</li>
                  <li>Yilin assessed their settings</li>
                </ul>
              </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SuperAdminAdminActivity;
