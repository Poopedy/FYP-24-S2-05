import React, { useEffect,useState } from 'react';
import axios from 'axios';
import { FaLock } from 'react-icons/fa';
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css';
import { jwtDecode } from "jwt-decode";


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // add async
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send email to backend for validation
      const response = await axios.post('https://cipherlink.xyz:5000/api/login', {
          email,
          password
      });
      // Log the full response for debugging
      console.log('Response from backend:', response);

      // Extract the token from the response
     
      const {  token, role,user } = response.data;
      console.log(user)
      
      // Debugging: Check the received token
      // console.log('Received token:', token);

      // Validate the token
      if (typeof token !== 'string' || token.trim() === '') {
        throw new Error('Invalid token received');
      }

      // Store the token in local storage
      localStorage.setItem('token', token);
      // Store user data in sessionStorage
      sessionStorage.setItem('user', JSON.stringify(user));
      // Decode the token to get the username
      const decodedToken = jwtDecode(token);
      // Debugging: Check the decoded token
      // console.log('Decoded token:', decodedToken);
      const username = decodedToken.username;
      console.log('Username',username)
      // Redirect based on role
      if (role === 'admin') {
          navigate('/admindashboard/${username}');
      } else if (role === 'user') {
          navigate('/userdashboard',{state : {username}});
      } else if (role === 'superadmin') {
          navigate('/superadmindashboard/${username}');
      } else {
          alert('Invalid role. Please try again.');
      }
  } catch (error) {
      console.error('Error logging in:', error);
      alert('Invalid email or password. Please try again.');
  }
};

  return (
    <div className='wrapper'>
      <header>
        <nav>
          <div className="logoLogin">
            <img src="/images/CipherLinkLogo.png" alt="CipherLink Logo Login" />
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
        <h1>Login</h1>
        <div className="login-input-box">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <MdEmail className='icon' />
        </div>
        <div className="login-input-box">
          <input 
            type="password" 
            placeholder="Password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}

          />
          <FaLock className='icon' />
        </div>

        <div className="remember-forgot">
          <label><input type="checkbox" />Remember me</label>
          <a href='/forgotpassword'>Forgot Password?</a>
        </div>

        <button className="RegLogButton" type="submit">Login</button>

        <div className="register-link">
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
