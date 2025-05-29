import React, { useState } from "react";
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
import LoginRegisterPopup from "../../components/authorization/LoginRegisterPopup";
function Contact(props) {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <div>
      <Header
        onLoginClick={() => setShowPopup(true)}
        onRegisterClick={() => setShowPopup(true)}
      />

      {showPopup && <LoginRegisterPopup onClose={() => setShowPopup(false)} />}
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
            <select name="type" id="type" required>
              <option value="">-- Loại thông tin* --</option>
              <option value="du-lich">Du lịch</option>
              <option value="cskh">CSKH</option>
              <option value="khac">Liên hệ thông tin khác</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Họ tên *"
              required
            />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email *"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="Số điện thoại *"
              required
            />
            <input
              type="text"
              id="company"
              name="company"
              placeholder="Tên công ty"
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              id="guests"
              name="guests"
              placeholder="Số khách"
            />
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Địa chỉ"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              id="subject"
              name="subject"
              placeholder="Tiêu đề *"
              required
            />
          </div>

          <div className="form-group">
            <textarea
              id="review"
              name="review"
              rows="5"
              placeholder="Nội dung *"
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-review-btn">
            Gửi liên hệ
          </button>
        </form>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Contact;
