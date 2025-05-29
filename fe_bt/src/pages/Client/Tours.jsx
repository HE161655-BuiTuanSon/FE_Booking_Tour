import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import LoginRegisterPopup from "../../components/authorization/LoginRegisterPopup";
import aboutBanner from "../../assets/about_banner.jpg";
import { getAllTour } from "../../services/Client/TourService";
import "../../styles/Client/Tour.css";
import {
  FaBus,
  FaClock,
  FaFlag,
  FaIdBadge,
  FaMapMarkerAlt,
  FaPlaneDeparture,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Tours() {
  const [allTour, setAllTour] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    priceMin: "",
    priceMax: "",
    destination: "",
    departurePoint: "",
  });
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const toursPerPage = 10;
  const formatVND = (value) => {
    if (typeof value === "number" && !isNaN(value)) {
      return value.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    }
    if (typeof value === "string") {
      const num = Number(value.replace(/[, ]+/g, ""));
      if (!isNaN(num)) {
        return num.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        });
      }
    }
    return "Giá trị không hợp lệ";
  };
  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const data = await getAllTour(currentPage, toursPerPage, filters);
        setAllTour(data.tours);
        console.log(allTour);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, [currentPage, filters]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Chưa xác định";
    const date = new Date(dateStr);
    const pad = (n) => n.toString().padStart(2, "0");
    return `${pad(date.getDate())}/${pad(
      date.getMonth() + 1
    )}/${date.getFullYear()}`;
  };

  const currentTours = allTour;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="tours-page">
      <Header
        onLoginClick={() => setShowPopup(true)}
        onRegisterClick={() => setShowPopup(true)}
      />
      {showPopup && <LoginRegisterPopup onClose={() => setShowPopup(false)} />}

      <div
        className="about-banner"
        style={{ backgroundImage: `url(${aboutBanner})` }}
      >
        <h2 className="banner-title">Tất cả điểm đến</h2>
      </div>

      <div className="tour-container" style={{ display: "flex" }}>
        <div
          className="filter-sidebar"
          style={{ width: "250px", padding: "20px" }}
        >
          <h3>Bộ lọc</h3>
          <div className="filter-group">
            <label>Giá (VNĐ)</label>
            <input
              type="number"
              name="priceMin"
              placeholder="Giá tối thiểu"
              value={filters.priceMin}
              onChange={handleFilterChange}
              className="tour-filter"
            />
            <input
              type="number"
              name="priceMax"
              placeholder="Giá tối đa"
              value={filters.priceMax}
              onChange={handleFilterChange}
              className="tour-filter"
            />
          </div>
          <div className="filter-group">
            <label>Điểm đến</label>
            <input
              type="text"
              name="destination"
              placeholder="Điểm đến..."
              value={filters.destination}
              onChange={handleFilterChange}
              className="tour-filter"
            />
          </div>
          <div className="filter-group">
            <label>Điểm khởi hành</label>
            <input
              type="text"
              name="departurePoint"
              placeholder="Điểm khởi hành..."
              value={filters.departurePoint}
              onChange={handleFilterChange}
              className="tour-filter"
            />
          </div>
        </div>

        <div className="tour-content" style={{ flex: 1, padding: "20px" }}>
          <div className="tour-card-grid">
            {currentTours.length > 0 ? (
              currentTours.map((tour) => (
                <div className="tour-card-all" key={tour.tourId}>
                  <img
                    src={tour.imageUrl || "https://via.placeholder.com/300x200"}
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
                          <FaPlaneDeparture /> <strong>Khởi hành:</strong>{" "}
                          {formatDate(tour.nextDeparture?.departureDate)}
                        </p>

                        <p className="info-tour">
                          <FaMapMarkerAlt /> <strong>Điểm đến:</strong>{" "}
                          {tour.destination || "N/A"}
                        </p>
                      </div>
                      <div className="info-2">
                        <p className="info-tour">
                          <FaFlag /> <strong>Điểm khởi hành:</strong>{" "}
                          {tour.departurePoint || "N/A"}
                        </p>

                        <p className="info-tour">
                          <FaBus /> <strong>Phương tiện:</strong>{" "}
                          {tour.transportation || "N/A"}
                        </p>

                        <p className="info-tour">
                          <FaClock /> <strong>Thời gian đi:</strong>{" "}
                          {tour.durationDays || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="price-tour">
                      <div className="info-price">
                        <strong>Giá từ:</strong>
                        <div className="price" style={{ fontWeight: "bold" }}>
                          {formatVND(tour.price)}
                        </div>
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
            ) : (
              <p>Không tìm thấy tour nào phù hợp với bộ lọc.</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={i + 1 === currentPage ? "active" : ""}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Tours;
