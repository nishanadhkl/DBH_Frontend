import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa"; 
import "../styles/global.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; 2025 Digital Book Haven. All rights reserved.</p>
      <div className="social-icons">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebook className="icon" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="icon" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter className="icon" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;



