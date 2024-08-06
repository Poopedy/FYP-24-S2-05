import React, { useEffect, useState } from 'react';
import './UserCloudServiceUpgrade.css';
import { FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { LuActivitySquare } from "react-icons/lu";
import { PiFilesFill } from "react-icons/pi";
import { HiSparkles } from "react-icons/hi2";
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserCloudServiceUpgrade = () => {
  const [planid, setPlanid] = useState(null); // Initialize planid state
  const [plan, setPlan] = useState({ name: '', price: 0, status: 'Inactive' });

  useEffect(() => {
    // Retrieve user data from sessionStorage
    const storedUser = sessionStorage.getItem('user');

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setPlanid(parsedUser.planid);
    }
  }, []); // Run only once to initialize planid

  useEffect(() => {
    const fetchPlan = async () => {
      if (!planid) return; // Do nothing if planid is not set

      try {
        const response = await axios.post('https://54.179.174.127:5000/api/getplan', { planid });
        console.log('Plan data:', response.data);
        setPlan(response.data);
      } catch (error) {
        console.error('Error fetching plan details:', error);
      }
    };

    fetchPlan();
  }, [planid]); // Run whenever planid changes
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
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Current Subscription Plan</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{plan.name}</td>
                  <td>Active</td>
                  <td>
                    <button className="cancel-button">Cancel</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <section className="upgrade-plans">
            <div className="upgrade-plan">
              <h4>BASIC</h4>
              <p style={{ fontSize: '1.3em' }}><b>FREE</b></p>
              <p>one-time purchase</p>
              <Link to="/userpayment">
                <button className='upgrade-button'>
                  Choose
                </button>
              </Link>
              <ul>
              <li>- 10GB File Transmission Size</li>
              <li>- 2 Cloud Ports</li>
              <li>- Allow File Size Add-ons</li>
              <li>- Allow Cloud Ports Add-ons</li>
              </ul>
            </div>
            <div className="upgrade-plan">
              <h4 style={{ color: '#71706e' }}>SILVER</h4>
              <p style={{ fontSize: '1.3em' }}><b>SGD 4.99</b></p>
              <p>one-time purchase</p>
              <Link to="/userpayment">
                <button className='upgrade-button'>
                  Choose
                </button>
              </Link>
              <ul>
              <li>- 20GB File Transmission Size</li>
              <li>- 4 Cloud Ports</li>
              <li>- Allow File Size Add-ons</li>
              <li>- Allow Cloud Ports Add-ons</li>
              </ul>
            </div>
            <div className="upgrade-plan">
              <h4 style={{ color: '#C59E01' }}>GOLD</h4>
              <p style={{ fontSize: '1.3em' }}><b>SGD 9.99</b></p>
              <p>one-time purchase</p>
              <Link to="/userpayment">
                <button className='upgrade-button'>
                  Choose
                </button>
              </Link>
              <ul>
              <li>- 50GB File Transmission Size</li>
              <li>- 5 Cloud Ports</li>
              <li>- Allow File Size Add-ons</li>
              <li>- Allow Cloud Ports Add-ons</li>
              </ul>
            </div>
          </section>
        </section>
      </div>
    </div>
  );
};

export default UserCloudServiceUpgrade;
