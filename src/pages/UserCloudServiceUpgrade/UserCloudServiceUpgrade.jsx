import React from 'react';
import './UserCloudServiceUpgrade.css';
import { FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { LuActivitySquare } from "react-icons/lu";
import { PiFilesFill } from "react-icons/pi";
import { HiSparkles } from "react-icons/hi2";
import { Link } from 'react-router-dom';

const UserCloudServiceUpgrade = () => {
  return (
    <div className="user-cloud-service-upgrade">
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
            <li className="userNotActive">
              <Link to="/useractivitybilling">
                <LuActivitySquare style={{ marginRight: '10px' }} />
                Activity Log & Billing
              </Link>
            </li>
          </ul>
        </nav>
        <div className="settings-logout">
          <div className="userActive">
            <HiSparkles style={{ marginRight: '10px' }} />
            Upgrade
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
      <div className="main-content-upgrade">
        <section className="user-upgrade-cloud-service">
          <h2>Upgrade Cloud Services</h2>
          <div className="services-container">
            <div className="service-google">
                <img src="/images/GoogleDrive.png" alt="Google Drive" />
            </div>
            <div className="service-onedrive">
                <img src="/images/OneDrive.png" alt="OneDrive" />
            </div>
            <div className="service-dropbox">
                <img src="/images/DropBox.jpg" alt="Dropbox" />
            </div> 
          </div>
            <section className="upgrade-plans">
                <div className="upgrade-plan">
                    <h4>STANDARD</h4>
                    <p>50 GB Free</p>
                    <p>SGD 10.00</p>
                    <p>one-time purchase</p>
                    <Link to="/userpayment">
                        <button className='upgrade-button'>
                        Buy now
                        </button>
                    </Link>
                    <ul>
                    <li>- Basic encryption</li>
                    <li>- Connect 2 or more cloud service</li>
                    </ul>
                </div>
                <div className="upgrade-plan">
                    <h4>PREMIUM</h4>
                    <p>50 GB Free + Other Benefits</p>
                    <p>SGD 20.00</p>
                    <p>/ month</p>
                    <Link to="/userpayment">
                        <button className='upgrade-button'>
                        Buy now
                        </button>
                    </Link>
                    <ul>
                    <li>- Enhanced security</li>
                    <li>- Convenient key management</li>
                    </ul>
                </div>
            </section>
        </section>
      </div>
    </div>
  );
};

export default UserCloudServiceUpgrade;