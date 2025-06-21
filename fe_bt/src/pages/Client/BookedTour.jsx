import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import aboutBanner from "../../assets/about_banner.jpg";
import Footer from "../../components/footer/Footer";
import LoginRegisterPopup from "../../components/authorization/LoginRegisterPopup";
import { getTourBooked } from "../../services/Client/TourService";
function BookedTour(props) {
  const [showPopup, setShowPopup] = useState(false);
  const [tourBooked, setTourBooked] = useState([]);
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    const fetchTourBooked = async () => {
      try {
        const response = await getTourBooked(userId);
        const result = await response.json();
        if (result.status === "success" && Array.isArray(result.data)) {
          setTourBooked(result.data);
        } else {
          setTourBooked([]);
          console.warn("Unexpected response format:", result);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tour đã đặt:", error);
        setTourBooked([]);
      }
    };
    fetchTourBooked();
  }, []);
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
        Booked Tour
      </div>
      <div className="tour-booked-container" style={{ padding: "20px" }}>
        {tourBooked.length === 0 ? (
          <p style={{ fontWeight: "bold" }}>Không có tour nào đã được đặt.</p>
        ) : (
          tourBooked.map((tour, index) => (
            <div
              key={index}
              className="booked-tour-item"
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "12px",
              }}
            >
              <h3>{tour.name}</h3>
              <p>Ngày đi: {tour.date}</p>
              <p>Số lượng: {tour.quantity}</p>
              <p>Giá: {tour.price} VND</p>
            </div>
          ))
        )}
      </div>
      <Footer></Footer>
    </div>
  );
}

export default BookedTour;
