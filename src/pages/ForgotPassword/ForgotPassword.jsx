import React, { useState, useEffect } from 'react';
import './ForgotPassword.css';
import { FaLock } from 'react-icons/fa';
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  // State variables to hold form data
  const [email, setEmail] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLocked, setIsLocked] = useState(true);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsSubmitEnabled(password && confirmPassword && password === confirmPassword);
  }, [password, confirmPassword]);

  const handlePassphraseSubmit = async () => {
    try {
      // Verify email and passphrase
      const response = await axios.post('https://cipherlink.xyz:5000/api/verify', { 
        email, 
        passphrase 
      });

      if (response.data.valid) {
        setIsLocked(false);
        setEmailVerified(true);
      } else {
        alert("Invalid email or passphrase!");
      }
    } catch (error) {
      console.error('Error verifying passphrase:', error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Submit the new password
      await axios.post('https://cipherlink.xyz:5000/api/resetPassword', { 
        email, 
        password 
      });
      alert("Password successfully reset!");
      navigate('/login');
    } catch (error) {
      console.error('Error resetting password:', error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className='wrapper'>
      <header>
        <nav>
          <div className="logoForgotPassword">
            <img src="/images/CipherLinkLogo.png" alt="CipherLink Logo Register" />
            <h1>CIPHERLINK</h1>
          </div>
          <div className="menu">
            <Link to="/">Home</Link>
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <Link to="/login"><button className="login">Login</button></Link>
          </div>
        </nav>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Forgot Password</h1>
        <div className="input-box">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <MdEmail className='icon' />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Enter Passphrase"
            required
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
          />
          <FaLock className='icon' />
        </div>
        <button type="button" className="submitPassphrase" onClick={handlePassphraseSubmit}>Submit Passphrase</button>
        <div className={`input-box password-input-box ${isLocked ? 'locked' : ''}`}>
          <input
            type="password"
            placeholder="New Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLocked}
          />
          <FaLock className='new-password-icon' />
        </div>
        <div className={`input-box con-password-input-box ${isLocked ? 'locked' : ''}`}>
          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLocked}
          />
          <FaLock className='confirm-password-icon' />
        </div>

        <button type="submit" className="resetPassword" disabled={!isSubmitEnabled}>Reset Password</button>
      </form>
    </div>
  );
}

export default ForgotPassword;
