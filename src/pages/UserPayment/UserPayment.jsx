import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './UserPayment.css';
import { FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { LuActivitySquare } from "react-icons/lu";
import { PiFilesFill } from "react-icons/pi";
import { HiSparkles } from "react-icons/hi2";
import { Link } from 'react-router-dom';

// Mapping plan IDs to their respective names
const planNames = {
  1: 'Basic',
  2: 'Silver',
  3: 'Gold'
};

const UserPayment = () => {
  const { planid } = useParams(); // Extract planid from URL parameters
  const [plan, setPlan] = useState({ name: '', price: 0, status: 'Inactive' })

  useEffect(() => {
    const fetchPlan = async () => {
      if (!planid) return; // Do nothing if planid is not set

      try {
        const response = await axios.post('http://localhost:5000/api/getplan', { planid });
        const fetchedPlan = response.data;
        fetchedPlan.name = planNames[planid]; // Set the plan name using the mapping
        setPlan(fetchedPlan);
      } catch (error) {
        console.error('Error fetching plan details:', error);
      }
    };

    fetchPlan();
  }, [planid]); // Run whenever planid changes

  const handleLogOut = () => {
    sessionStorage.clear();
  };

  return (
    <div className="user-payment">
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
            <Link to="/login" onClick={handleLogOut}>
                <IoLogOut style={{ marginRight: '10px' }} />
                Logout
            </Link>
        </div>
        </div>
    </div>
    <div className="main-content-payment">
        <section className="user-make-payment">
          <h2>Payment</h2>
          <form>
          <label>
              Plan:
              <input 
                type="text"
                name="Plan"
                value={plan.name}
                className='input-readOnly' readOnly
              />
            </label>
            <label>
              Cost:
              <input
                type="text"
                name="cost"
                value={plan.price}
                className='input-readOnly' readOnly
              />
            </label>
            <label>
                Card Number:
                <input
                  type="text"
                  name="cardnumber"
                />
              </label>
              <label>
                Expiry Date:
                <input
                  type="text"
                  name="expirydate"
                />
              </label>
              <label>
                CVV:
                <input
                  type="text"
                  name="cvv"
                />
              </label>
              <label>
                Card Holder Name:
                <input
                  type="text"
                  name="cardholdername"
                />
              </label>
            <div className="form-buttons">
              <Link to="/usercloudserviceupgrade"><button type="button" className="back">
                Back
              </button></Link>
              <button type="button" className="proceed">
                Proceed
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default UserPayment;
