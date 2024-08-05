import React, { useState, useEffect } from 'react';
import './GenerateKeyPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { generate256BitKey } from '../../../utilities/clientKeyUtilities';
import { encryptWithPassphrase } from '../../../models/encryptionModel';
import axios from 'axios';

const GenerateKeyPage = () => {
  const [userId, setUserId] = useState(null);
  // State to store the generated key
  const [encryptionKey, setEncryptionKey] = useState('');
  // State to store passphrase
  const [passphrase, setPassphrase] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user info from session storage
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    if (storedUser && storedUser.id) {
        setUserId(storedUser.id);
    } else {
        console.error('No userId found in session storage');
    }
}, []);

  // Handler to generate a new key when the button is clicked
  const handleGenerateClick = async (event) => {
    event.preventDefault(); // Prevent form submission
    const newKey = await generate256BitKey();
    const keyBuffer = await window.crypto.subtle.exportKey('raw', newKey);
    const keyArray = new Uint8Array(keyBuffer);
    const keyString = keyArray.slice(0, 6).reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
    setEncryptionKey(keyString);
  };

  const handlePassphraseChange = (e) => {
    setPassphrase(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!userId) {
        throw new Error('User ID not found');
      }

      // Encrypt encryption key with passphrase
      const encryptedData = await encryptWithPassphrase(encryptionKey, passphrase);
      // Convert encryptedData (Array) to Base64 string
      const encryptedKeyString = btoa(String.fromCharCode(...new Uint8Array(encryptedData)));

      await axios.put('http://localhost:5000/api/passphrase', {
        userId,
        passphrase
      });

      await axios.post('http://localhost:5000/api/saveEncryptionKey', {
        userId,
        encryptedKey: encryptedKeyString
      });

      navigate('/userdashboard');
    } catch (error) {
      console.error('Update failed', error);
    }
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

      <form onSubmit={handleSubmit}>
        <h1>Create Encryption Key & Passphrase</h1>
        <p>Encrypt your files with CipherLink!</p>
        <div className="input-box">
          <input type="text" value={encryptionKey} readOnly />
          <button className="Generate" onClick={handleGenerateClick}>Generate</button>
        </div>
        <div className="input-box">
          <input type="password" value={passphrase} onChange={handlePassphraseChange} placeholder='Passphrase' required />
        </div>
        <button className="Proceed" type="submit">Proceed</button>
      </form>
    </div>
  );
}

export default GenerateKeyPage;
