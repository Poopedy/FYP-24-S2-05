import React from 'react';
import './UserActivityBilling.css';
import { FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { LuActivitySquare } from "react-icons/lu";
import { PiFilesFill } from "react-icons/pi";
import { HiSparkles } from "react-icons/hi2";
import { Link } from 'react-router-dom';

const UserActivityBilling = () => {
  return (
    <div className="user-account-activity-billing">
      <div className="sidebar">
        <div className="logoUser">
          <img src="/images/CipherLinkLogo.png" alt="CipherLink Logo Login" />
          <p>CipherLink Trusted Cloud</p>
        </div>
        <nav>
          <ul>
            <li className="userNotActive">
              <Link to="/userdashboard">
                <PiFilesFill style={{ marginRight: '10px' }} />
                My Files
              </Link>
            </li>
            <li className="userActive">
                <LuActivitySquare style={{ marginRight: '10px' }} />
                Activity Log & Billing
            </li>
          </ul>
        </nav>
        <div className="settings-logout">
          <div className="userNotActive">
            <Link to="/usercloudserviceupgrade">
            <HiSparkles style={{ marginRight: '10px' }} />
            Upgrade
            </Link>
          </div>
          <div className="userNotActive">
            <Link to="/useraccmanagement">
              <IoMdSettings style={{ marginRight: '10px' }} />
              Settings
            </Link>
          </div>
          <div className="userNotActive">
            <Link to="/login">
              <IoLogOut style={{ marginRight: '10px' }} />
              Logout
            </Link>
          </div>
        </div>
      </div>
      <div className="main-content-activity-billing">
        <section className="user-act-bill">
          <h2>Activity Log & Billing</h2>
          <div className="form-buttons">
            <Link to="/userdashboard"><button type="button" className="back">
              Back
            </button></Link>
          </div>
          <div className="content-container">
            <div className="activity-chart">
              <img src="/images/ActivityChart.png" alt="User Activity Chart" />
              <div className="last-accessed">
                <p>Last accessed on: ...</p>
                <ul>
                  <li>User uploaded file on google drive</li>
                  <li>User downloaded file</li>
                  <li>User assessed their settings</li>
                  <li>User updated...</li>
                  <li>User upgraded to Premium package</li>
                </ul>
              </div>
            </div>
            <div className="billing-info-container">
              <div className="billing-info">
                <table>
                  <thead>
                    <tr>
                      <th>Package</th>
                      <th>Cost</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Premium</td>
                      <td>$20.00</td>
                      <td>
                        <Link to="/userpayment"><button className="pay-button">Pay</button></Link>
                      </td>
                    </tr>
                    <tr>
                      <td>Freenium</td>
                      <td>$00.00</td>
                      <td>
                      </td>
                    </tr>
                    <tr>
                      <td>Freenium</td>
                      <td>$00.00</td>
                      <td>
                      </td>
                    </tr>
                    <tr>
                      <td>Freenium</td>
                      <td>$00.00</td>
                      <td>
                      </td>
                    </tr>
                    <tr>
                      <td>Freenium</td>
                      <td>$00.00</td>
                      <td>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserActivityBilling;