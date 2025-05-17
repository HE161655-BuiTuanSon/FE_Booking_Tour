import React from "react";
import Header from "../../components/header/Header";
import aboutBanner from "../../assets/about_banner.jpg";
import "../../styles/Client/Contact.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import background from "../../assets/background.png";
import {
  faMapMarkerAlt,
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import Footer from "../../components/footer/Footer";
function Contact(props) {
  return (
    <div>
      <Header></Header>
      <div
        className="about-banner"
        style={{ backgroundImage: `url(${aboutBanner})` }}
      >
        Contacts
      </div>
      <div className="info-contact">
        <div className="item-contact">
          <div className="icon">
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              style={{ color: "#dc5a26", fontSize: "50px" }}
            />
          </div>
          <div className="title-contact">Address</div>
          <div className="des-contact">Vietnam</div>
        </div>
        <div className="item-contact">
          <div className="icon">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="contact-icon"
              style={{ color: "#dc5a26", fontSize: "50px" }}
            />
          </div>
          <div className="title-contact">Mail</div>
          <div className="des-contact">blackpink@gmail.com</div>
        </div>
        <div className="item-contact">
          <div className="icon">
            <FontAwesomeIcon
              icon={faPhone}
              className="contact-icon"
              style={{ color: "#dc5a26", fontSize: "50px" }}
            />
          </div>
          <div className="title-contact">Phone</div>
          <div className="des-contact">+84936367710</div>
        </div>
      </div>
      <div
        className="send-review"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="review-title">Send us a Review</div>
        <form className="review-form">
          <div className="form-group">
            <input type="text" id="name" name="name" placeholder="Your name" />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Your email"
            />
          </div>
          <div className="form-group">
            <textarea
              id="review"
              name="review"
              rows="5"
              placeholder="Write your review here..."
            ></textarea>
          </div>
          <button type="submit" className="submit-review-btn">
            Submit
          </button>
        </form>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Contact;
