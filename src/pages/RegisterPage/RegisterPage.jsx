import React, { useState } from 'react';
import './RegisterPage.css';
import { FaUser, FaLock } from 'react-icons/fa';
import { MdEmail } from "react-icons/md";
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios for making HTTP requests

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault(); 

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      // Send registration data to the backend
      const response = await axios.post('http://54.179.174.127:5000/api/register', {
        username,
        email,
        password,
        role: 'user', // Default role
        planid: 1 // Default planid
      });

      // Handle successful registration (e.g., redirect to login page)
      console.log('Registration successful:', response.data);
      // Optionally, you can redirect the user to the login page
      // navigate('/login');

    } catch (error) {
      console.error('Error registering:', error);
      alert('Error registering. Please try again.');
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
            type="username"
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
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <FaLock className='icon' />
        </div>

        <button className="RegLogButton" type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
