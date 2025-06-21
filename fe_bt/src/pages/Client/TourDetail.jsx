import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTourById } from "../../services/Client/TourService";
import "../../styles/Client/TourDetail.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { motion } from "framer-motion";
import {
  FaBinoculars,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaPlane,
  FaPlaneDeparture,
  FaTags,
  FaUsers,
  FaUtensils,
} from "react-icons/fa";

function TourDetail() {
  const [dataTour, setDataTour] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const { tourId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [selectedDeparture, setSelectedDeparture] = useState(null);
  const toggleNote = (id) => {
    setActiveNoteId((prevId) => (prevId === id ? null : id));
  };
  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === dataTour.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? dataTour.images.length - 1 : prevIndex - 1
    );
  };

  const fixDriveUrl = (url) => {
    if (typeof url !== "string") return url;
    if (!url.includes("drive.google.com/uc?id=")) return url;

    const parts = url.split("id=");
    const fileId = parts[1]?.split("&")[0];
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  };

  useEffect(() => {
    const fetchDetailTour = async () => {
      try {
        setIsLoaded(false);
        const data = await getTourById(tourId);
        setDataTour(data);
        setIsLoaded(true);
      } catch (error) {
        setError(error.message || "Failed to fetch tour details");
        setIsLoaded(true);
      }
    };

    fetchDetailTour();
  }, [tourId]);

  // Loading state
  if (!isLoaded) {
    return (
      <div className="loading-container">
        <p>Loading tour details...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
      </div>
    );
  }
  dataTour.notes = [
    {
      id: 1,
      title: "Điều kiện hủy tour",
      content: "Bạn có thể hủy tour trước 7 ngày và nhận lại 80% tiền.",
    },
    {
      id: 2,
      title: "Trang phục phù hợp",
      content: "Nên mặc đồ thoải mái, giày thể thao để tiện di chuyển.",
    },
    {
      id: 3,
      title: "Thời tiết",
      content: "Chuẩn bị áo mưa nếu đi vào mùa mưa, kem chống nắng mùa hè.",
    },
  ];

  // Success state
  return (
    <div className="page-wrapper">
      <Header />
      <motion.div
        className="tour-detail-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {dataTour ? (
          <div className="tour-detail">
            <motion.div
              className="tour-header"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1>{dataTour.tourName}</h1>
              <p>{dataTour.description}</p>
            </motion.div>

            <div className="tour-content-detail">
              {dataTour.images?.length > 0 && (
                <div className="tour-image-slider">
                  <motion.img
                      key={dataTour.images[currentIndex]}
                      src={fixDriveUrl(dataTour.images[currentIndex])}
                      alt={`${dataTour.tourName} - ${currentIndex + 1}`}
                      className="tour-image-detail"
                      initial={{opacity: 0, x: 100}}
                      animate={{opacity: 1, x: 0}}
                      exit={{opacity: 0, x: -100}}
                      transition={{duration: 0.5}}
                  />

                  <div className="slider-controls">
                    <button onClick={prevImage}>‹</button>
                    <button onClick={nextImage}>›</button>
                  </div>
                </div>
              )}

              <div className="tour-info">
                <div className="tour-info-grid">
                <div className="tour-info-column">
                    <p className="info-price-detail">
                      <strong>Giá:</strong>
                      <span
                        className="price"
                        style={{ fontWeight: "bold", fontSize: "40px" }}
                      >
                        {dataTour.price.toLocaleString("vi-VN")} VND / Khách
                      </span>
                    </p>
                    <p>
                      <FaMapMarkerAlt
                        style={{ marginRight: "5px", color: "#0b5da7" }}
                      />
                      <strong>Điểm đến:</strong>{" "}
                      <span className="info-detail-tour">
                        {dataTour.destinationName || "N/A"}
                      </span>
                    </p>
                    <p>
                      <FaPlaneDeparture
                        style={{ marginRight: "5px", color: "#0b5da7" }}
                      />
                      <strong>Khởi hành:</strong>{" "}
                      <span className="info-detail-tour">
                        {dataTour.departurePointName || "N/A"}
                      </span>
                    </p>
                    <p>
                      <FaClock
                        style={{ marginRight: "5px", color: "#0b5da7" }}
                      />
                      <strong>Thời gian:</strong>{" "}
                      <span className="info-detail-tour">
                        {dataTour.durationDays || "N/A"}
                      </span>
                    </p>
                    <p>
                      <FaBinoculars
                        style={{ marginRight: "5px", color: "#0b5da7" }}
                      />
                      <strong>Tham quan:</strong>{" "}
                      <span className="info-detail-tour">
                        {dataTour.sightseeingSpot || "N/A"}
                      </span>
                    </p>
                  </div>
                  <div className="tour-info-column">
                    <p>
                      <FaUtensils
                        style={{ marginRight: "5px", color: "#0b5da7" }}
                      />
                      <strong>Ẩm thực:</strong>
                      <span className="info-detail-tour">
                        {dataTour.cuisine || "N/A"}
                      </span>{" "}
                    </p>
                    <p>
                      <FaUsers
                        style={{ marginRight: "5px", color: "#0b5da7" }}
                      />
                      <strong>Phù hợp:</strong>{" "}
                      <span className="info-detail-tour">
                        {dataTour.suitableSubject || "N/A"}
                      </span>
                    </p>
                    <p>
                      <FaCalendarAlt
                        style={{ marginRight: "5px", color: "#0b5da7" }}
                      />
                      <strong>Thời điểm lý tưởng:</strong>{" "}
                      <span className="info-detail-tour">
                        {dataTour.idealTime || "N/A"}
                      </span>
                    </p>
                    <p>
                      <FaPlane
                        style={{ marginRight: "5px", color: "#0b5da7" }}
                      />
                      <strong>Phương tiện:</strong>
                      <span className="info-detail-tour">
                        {dataTour.vehicle || "N/A"}
                      </span>{" "}
                    </p>
                    <p>
                      <FaTags
                        style={{ marginRight: "5px", color: "#0b5da7" }}
                      />
                      <strong>Khuyến mãi:</strong>{" "}
                      <span className="info-detail-tour">
                        {dataTour.promotion || "Không có"}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="tour-extra">
                  <div className="info-bonus">
                    {dataTour.category?.length > 0 && (
                      <p className="info-extra">
                        <strong>Loại tour:</strong>{" "}
                        {dataTour.category[0].categoryName}
                      </p>
                    )}
                    {dataTour.transportationMethod?.length > 0 && (
                      <p className="info-extra">
                        <strong>Di chuyển:</strong>{" "}
                        {dataTour.transportationMethod[0].methodName}
                      </p>
                    )}
                  </div>

                  <button
                    className="book-now-btn"
                    onClick={() => {
                      if (!selectedDeparture) {
                        alert(
                          "Vui lòng chọn ngày khởi hành trước khi đặt tour."
                        );
                        return;
                      }
                      window.location.href = `/tours/${tourId}/booking?departureId=${selectedDeparture.departureId}`;
                    }}
                  >
                    Đặt ngay
                  </button>
                </div>
              </div>
            </div>

            {dataTour.departureDates?.length > 0 && (
              <div className="departure-dates">
                <h2
                  style={{
                    textAlign: "start",
                    color: "#0b5da7",
                    fontWeight: "700",
                  }}
                >
                  Ngày khởi hành khả dụng
                </h2>
                <div className="departure-dates-grid">
                  {dataTour.departureDates.map((date) => (
                    <motion.div
                      key={date.departureId}
                      className={`departure-card ${
                        selectedDeparture?.departureId === date.departureId
                          ? "selected"
                          : ""
                      } ${date.isActive ? "active" : "inactive"}`}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => {
                        if (date.isActive) setSelectedDeparture(date);
                      }}
                      style={{
                        cursor: date.isActive ? "pointer" : "not-allowed",
                      }}
                    >
                      <p>
                        <strong>Ngày:</strong>{" "}
                        {new Date(date.departureDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                      <p>
                        <strong>Chỗ còn:</strong> {date.availableSlots}
                      </p>
                      <p>
                        <strong>Trạng thái:</strong>{" "}
                        {date.isActive ? "Còn hoạt động" : "Ngưng"}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="no-data">Không có thông tin tour</p>
        )}
        <div className="notes-section">
          <h2>Thông tin cần lưu ý</h2>
          <ul className="notes-list">
            {dataTour.notes?.map((note) => (
              <li key={note.id} className="note-item">
                <button
                  className="note-title"
                  onClick={() => toggleNote(note.id)}
                  aria-expanded={activeNoteId === note.id}
                  aria-controls={`note-content-${note.id}`}
                >
                  {note.title}
                  <span className="arrow">
                    {activeNoteId === note.id ? "▲" : "▼"}
                  </span>
                </button>
                {activeNoteId === note.id && (
                  <div id={`note-content-${note.id}`} className="note-content">
                    {note.content}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
}

export default TourDetail;
