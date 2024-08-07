import React, { useState, useEffect } from 'react';
import './RegisterPage.css';
import { FaUser, FaLock } from 'react-icons/fa';
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  // State variables to hold form data
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  useEffect(() => {
    setIsSubmitEnabled(username && email && password && confirmPassword && password === confirmPassword);
  }, [username, email, password, confirmPassword]);

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  };

  return (
    <div className='wrapper'>
      <header>
        <nav>
          <div className="logoRegister">
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
        <h1>Register</h1>
        <div className="input-box">
          <input 
            type="text" 
            name="username"
            placeholder="Username" 
            required 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FaUser className='icon' />
        </div>
        <div className="input-box">
          <input 
            type="email" 
            name="email"
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
            name="password"
            placeholder="Password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
          <FaLock className='icon' />
        </div>
        <div className="input-box">
          <input 
            type="password" 
            name="confirmPassword"
            placeholder="Confirm Password" 
            required 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <FaLock className='icon' />
        </div>

        <button className="RegLogButton" type="submit" disabled={!isSubmitEnabled}>Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;