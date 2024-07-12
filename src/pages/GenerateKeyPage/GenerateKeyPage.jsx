import React, { useState } from 'react';
import './GenerateKeyPage.css';
import { FaKey } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const GenerateKeyPage = () => {
  // Function to generate a random string
  const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // State to store the generated key
  const [encryptionKey, setEncryptionKey] = useState('');

  // Handler to generate a new key when the button is clicked
  const handleGenerateClick = (event) => {
    event.preventDefault(); // Prevent form submission
    const newKey = generateRandomString(16);
    setEncryptionKey(newKey);
  };

  return (
    <div className='wrapper'>
      <header>
        <nav>
          <div className="logoGenerate">
            <img src="/images/CipherLinkLogo.png" alt="CipherLink Logo Generate" />
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
        <h1>Generate Encryption Key</h1>
        <p>Encrypt your files with CipherLink!</p>
        <div className="input-box">
          <input type="text" value={encryptionKey} readOnly />
          <FaKey className='icon' />
        </div>
        <button className="Generate" onClick={handleGenerateClick}>Generate</button>
        <Link to="/userdashboard"><button className="Proceed" type="submit">Proceed</button></Link>
      </form>
    </div>
  );
}

export default GenerateKeyPage;
