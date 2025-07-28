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
import { createConsultation } from "../../services/Client/reviewService";
function Contact(props) {
  const [showPopup, setShowPopup] = useState(false);
  const [formValues, setFormValues] = useState({
    type: "", // chính là informationType
    name: "",
    email: "",
    phone: "",
    company: "",
    guests: "",
    address: "",
    subject: "",
    review: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      consultationId: 0,
      fullName: formValues.name,
      phone: formValues.phone,
      email: formValues.email,
      title: formValues.subject,
      additionalInfo: formValues.review,
      createdAt: new Date().toISOString(),
      informationType: formValues.type, // ✅ đúng rồi
      companyName: formValues.company,
      address: formValues.address,
      clientNumber: formValues.guests ? parseInt(formValues.guests) : 0,
      status: "pending",
    };

    try {
      await createConsultation(formData);
      alert("Liên hệ đã được gửi thành công!");

      setFormValues({
        type: "",
        name: "",
        email: "",
        phone: "",
        company: "",
        guests: "",
        address: "",
        subject: "",
        review: "",
      });
    } catch (error) {
      console.error("Lỗi gửi liên hệ:", error);
      alert("Đã xảy ra lỗi khi gửi liên hệ.");
    }
  };

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
              style={{ color: "#091e55", fontSize: "50px" }}
            />
          </div>
          <div className="title-contact">Address</div>
          <div className="des-contact">278 Nguyễn Trãi, Thanh Xuân Hà Nội</div>
        </div>
        <div className="item-contact">
          <div className="icon">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="contact-icon"
              style={{ color: "#091e55", fontSize: "50px" }}
            />
          </div>
          <div className="title-contact">Mail</div>
          <div className="des-contact">Vivutraveltour@gmail.com</div>
        </div>
        <div className="item-contact">
          <div className="icon">
            <FontAwesomeIcon
              icon={faPhone}
              className="contact-icon"
              style={{ color: "#091e55", fontSize: "50px" }}
            />
          </div>
          <div className="title-contact">Phone</div>
          <div className="des-contact">0779991838</div>
        </div>
      </div>
      <div
        className="send-review"
        style={{ backgroundColor:"rgb(218, 239, 255)" }}
      >
        <div className="review-title">Send us a Review</div>
        <form className="review-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <select
              name="type"
              id="type"
              required
              value={formValues.type}
              onChange={handleChange}
            >
              <option value="">-- Loại thông tin* --</option>
              <option value="du-lich">Du lịch</option>
              <option value="cskh">CSKH</option>
              <option value="khac">Liên hệ thông tin khác</option>
            </select>
            <input
              type="text"
              id="name"
              name="name"
              value={formValues.name}
              placeholder="Họ tên *"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              id="email"
              value={formValues.email}
              name="email"
              placeholder="Email *"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              id="phone"
              value={formValues.phone}
              name="phone"
              placeholder="Số điện thoại *"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              id="company"
              value={formValues.company}
              name="company"
              onChange={handleChange}
              placeholder="Tên công ty"
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              id="guests"
              value={formValues.guests}
              onChange={handleChange}
              name="guests"
              placeholder="Số khách"
            />
            <input
              type="text"
              id="address"
              value={formValues.address}
              onChange={handleChange}
              name="address"
              placeholder="Địa chỉ"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              id="subject"
              value={formValues.subject}
              onChange={handleChange}
              name="subject"
              placeholder="Tiêu đề *"
              required
            />
          </div>

          <div className="form-group">
            <textarea
              id="review"
              name="review"
              value={formValues.review}
              onChange={handleChange}
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
