import React from 'react';
import './RegisterPage.css';
import { FaUser, FaLock } from 'react-icons/fa';
import { MdEmail } from "react-icons/md";
import { Link } from 'react-router-dom';

const RegisterPage = () => {
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

      <form action="">
        <h1>Register</h1>
        <div className="input-box">
          <input type="text" placeholder="Username" required />
          <FaUser className='icon' />
        </div>
        <div className="input-box">
          <input type="email" placeholder="Email" required />
          <MdEmail className='icon' />
        </div>
        <div className="input-box">
          <input type="password" placeholder="Password" required />
          <FaLock className='icon' />
        </div>
        <div className="input-box">
          <input type="password" placeholder="Confirm Password" required />
          <FaLock className='icon' />
        </div>

        <Link to="/generatekey"><button className="RegLogButton" type="submit">Register</button></Link>
      </form>
    </div>
  );
}

export default RegisterPage;
