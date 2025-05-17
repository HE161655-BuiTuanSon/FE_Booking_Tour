import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer-container">
      <div className="social">
        <div className="item-social">
          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <FaFacebookF /> <span>Facebook</span>
          </a>
        </div>
        <div className="divider" />
        <div className="item-social">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <FaInstagram /> <span>Instagram</span>
          </a>
        </div>
        <div className="divider" />
        <div className="item-social">
          <a
            href="https://www.youtube.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <FaYoutube /> <span>Youtube</span>
          </a>
        </div>
      </div>
      <div className="info-legit">
        <p>Về làng © 2025. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
