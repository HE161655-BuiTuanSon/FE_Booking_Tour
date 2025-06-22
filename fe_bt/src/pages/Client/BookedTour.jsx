import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import aboutBanner from "../../assets/about_banner.jpg";
import Footer from "../../components/footer/Footer";
import LoginRegisterPopup from "../../components/authorization/LoginRegisterPopup";
import { getTourBooked } from "../../services/Client/TourService";
import { useNavigate } from "react-router-dom";
import {
  FaIdBadge,
  FaPlaneDeparture,
  FaMapMarkerAlt,
  FaFlag,
  FaBus,
  FaClock,
  FaUserFriends,
} from "react-icons/fa";
import "../../styles/Client/TourBooked.css";

function BookedTour() {
  const [showPopup, setShowPopup] = useState(false);
  const [tourBooked, setTourBooked] = useState([]);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const fixDriveUrl = (url) => {
    if (!url || typeof url !== "string")
      return "https://via.placeholder.com/300x200";
    if (!url.includes("drive.google.com/uc?id=")) return url;
    const parts = url.split("id=");
    const fileId = parts[1]?.split("&")[0];
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w600`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatVND = (number) => {
    if (!number) return "0 VND";
    return Number(number).toLocaleString("vi-VN") + " VND";
  };

  useEffect(() => {
    const fetchTourBooked = async () => {
      try {
        const response = await getTourBooked(userId);
        console.log(response);
        if (response.status === "success" && Array.isArray(response.data)) {
          setTourBooked(response.data);
        } else {
          setTourBooked([]);
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
        <h2 className="banner-title">Tour đã đặt</h2>
      </div>

      <div className="tour-booked-container">
        {tourBooked.length === 0 ? (
          <p className="no-tour">Bạn chưa đặt tour nào.</p>
        ) : (
          tourBooked.map((tour) => (
            <div className="tour-card-all" key={tour.tourId}>
              <img
                src={fixDriveUrl(tour.imageUrl)}
                alt={tour.tourName}
                className="tour-image"
              />
              <div className="tour-info">
                <h1 className="title-tour">{tour.tourName}</h1>
                <div className="tour-sub-info">
                  <div className="info-1">
                    <p className="info-tour">
                      <FaIdBadge /> <strong>Mã tour:</strong>{" "}
                      {tour.tourId || "N/A"}
                    </p>
                    <p className="info-tour">
                      <FaUserFriends /> <strong>Số người:</strong>{" "}
                      {tour.numberOfParticipants || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="price-tour">
                  <div className="info-price">
                    <strong>Giá từ:</strong>
                    <div className="price">{formatVND(tour.totalAmount)}</div>
                  </div>
                  <button
                    className="btn-detail-tour"
                    onClick={() => {
                      navigate(`/tour/tour-detail/${tour.tourId}`);
                    }}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Footer />
    </div>
  );
}

export default BookedTour;
