import React from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="HomePage">
      <header>
        <nav>
          <div className="logo">
          <img src="/images/logo.JPG" alt="CipherLink Logo"/>

          </div>
          <div className="menu">
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <Link to="/login"><button className="login">Login</button></Link>
          </div>
        </nav>
        <div className="hero">
          <h2>Start Your CipherLink Journey</h2>
          <p><b>Your Hassle Free Solution To A Secure Cloud Storage</b></p>
          <img src="/images/Hero.JPG" alt="Hero" />
        </div>
      </header>
      
      <section className="features">
        <h3>Protect Your Files with State-Of-The-Art Security: Say Goodbye to Cloud Privacy Concerns!</h3>
        <p>Discover How We Shield Your Files from Prying Eyes and Unauthorized Access, Keeping Your Data Safe in the Cloud!</p>
      </section>

      <h2>Sign up for a 7 day free trial with us!</h2>

      <section className="plans">
        <div className="plan">
          <h4>BASIC</h4>
          <p style={{ fontSize: '1.3em' }}><b>FREE</b></p>
          <p>one-time purchase</p>
          <button>Choose</button>
          <ul>
            <li>- 10GB File Transmission Size</li>
            <li>- 2 Cloud Ports</li>
            <li>- Allow File Size Add-ons</li>
            <li>- Allow Cloud Ports Add-ons</li>
          </ul>
        </div>
        <div className="plan">
          <h4 style={{ color: '#71706e' }}>SILVER</h4>
          <p style={{ fontSize: '1.3em' }}><b>SGD 4.99</b></p>
          <p>one-time purchase</p>
          <button>Choose</button>
          <ul>
            <li>- 20GB File Transmission Size</li>
            <li>- 4 Cloud Ports</li>
            <li>- Allow File Size Add-ons</li>
            <li>- Allow Cloud Ports Add-ons</li>
          </ul>
        </div>
        <div className="plan">
          <h4 style={{ color: '#C59E01' }}>GOLD</h4>
          <p style={{ fontSize: '1.3em' }}><b>SGD 9.99</b></p>
          <p>one-time purchase</p>
          <button>Choose</button>
          <ul>
            <li>- 50GB File Transmission Size</li>
            <li>- 5 Cloud Ports</li>
            <li>- Allow File Size Add-ons</li>
            <li>- Allow Cloud Ports Add-ons</li>
          </ul>
        </div>
      </section>

      <section className="trial">
        <h2>Testimonials</h2>
        <div className="testimonials">
          <div className="testimonial">
            <img src="/images/user1.JPG" alt="User 1" />
            <p>
              "I used to worry about unauthorized access to my files, but with CipherLink, I feel confident and secure!"
            </p>
          </div>
          <div className="testimonial">
            <img src="/images/user2.JPG" alt="User 2" />
            <p>
              "As a freelance photographer, the security of my digital files is paramount. CipherLink gives me peace of mind."
            </p>
          </div>
          <div className="testimonial">
            <img src="/images/user3.JPG" alt="User 3" />
            <p>
              "With our team spread across different locations, CipherLink ensures our files are always safe and accessible."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;