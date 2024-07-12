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
          <h4>FREEMIUM</h4>
          <p>10 GB Free</p>
          <p>SGD 0.00</p>
          <p>for a lifetime</p>
          <button>Get started</button>
          <ul>
            <li>- Basic encryption</li>
            <li>- Connect 1 cloud service</li>
          </ul>
        </div>
        <div className="plan">
          <h4>STANDARD</h4>
          <p>50 GB Free</p>
          <p>SGD 10.00</p>
          <p>one-time purchase</p>
          <button>Buy now</button>
          <ul>
            <li>- Basic encryption</li>
            <li>- Connect 2 or more cloud service</li>
          </ul>
        </div>
        <div className="plan">
          <h4>PREMIUM</h4>
          <p>50 GB Free + Other Benefits</p>
          <p>SGD 20.00</p>
          <p>/ month</p>
          <button>Buy now</button>
          <ul>
            <li>- Enhanced security</li>
            <li>- Convenient key management</li>
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