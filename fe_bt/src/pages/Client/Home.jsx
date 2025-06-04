import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import LoginRegisterPopup from "../../components/authorization/LoginRegisterPopup";
import ImageBanner from "../../components/ImageBanner";
import "../../styles/Client/Home.css";
import { useNavigate } from "react-router-dom";
import tour from "../../assets/tour.png";
import {
  FaBus,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaSearch,
} from "react-icons/fa";
import three1 from "../../assets/three1.png";
import three2 from "../../assets/three2.png";
import three3 from "../../assets/three3.png";
import { getFourPosts } from "../../services/Client/PostService";
import { getTenTour } from "../../services/Client/TourService";
function Home(props) {
  const [showPopup, setShowPopup] = useState(false);
  const [showPromoPopup, setShowPromoPopup] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [destination, setDestination] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [fourPosts, setFourPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tourData, setTourData] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getFourPosts();
        setFourPosts(data);
      } catch (error) {
        console.error("Lỗi khi gọi getFourPost:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await getTenTour();
        setTourData(data);
      } catch (error) {
        console.error("Lỗi khi gọi getFourPost:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("promoPopupShown")) {
      return;
    }

    let timeoutId;
    let interactionHandled = false;

    const handleInteraction = () => {
      if (interactionHandled) return;
      interactionHandled = true;

      timeoutId = setTimeout(() => {
        setShowPromoPopup(true);
        sessionStorage.setItem("promoPopupShown", "true");
      }, 3000);

      // Sau khi xử lý tương tác đầu tiên, gỡ bỏ listener
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("mousemove", handleInteraction);
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("scroll", handleInteraction);
    window.addEventListener("mousemove", handleInteraction);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("mousemove", handleInteraction);
    };
  }, []);
  const popularDestinations = [
    { name: "Da Lat", country: "Vietnam" },
    { name: "Vung Tau", country: "Vietnam" },
    { name: "Ho Chi Minh City", country: "Vietnam" },
    { name: "Da Nang", country: "Vietnam" },
    { name: "Hanoi", country: "Vietnam" },
  ];

  const fixDriveUrl = (url) => {
    if (typeof url !== "string") return url;
    if (!url.includes("drive.google.com/uc?id=")) return url;

    const parts = url.split("id=");
    const fileId = parts[1]?.split("&")[0];
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  };

  const handleInputClick = () => {
    setIsDropdownOpen(true);
  };

  const handleSelectDestination = (destinationName) => {
    setDestination(destinationName);
    setIsDropdownOpen(false);
  };
  const PromoPopup = ({ onClose }) => {
    const navigate = useNavigate();
    const popupRef = useRef(null);

    const handleBookNow = () => {
      sessionStorage.setItem("promoPopupShown", "true");
      navigate("/tours");
      onClose();
    };

    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        sessionStorage.setItem("promoPopupShown", "true");
        onClose();
      }
    };

    return (
      <div className="promo-popup" onClick={handleClickOutside}>
        <div className="promo-popup-content" ref={popupRef}>
          <img src={tour} alt="Promo Tour" className="promo-image" />
          <h2>Get 10% Off Your Next Tour!</h2>
          <p>
            Book now and save on your dream Vietnam adventure. Limited offer!
          </p>
          <button onClick={handleBookNow} className="book-button">
            Book Now
          </button>
        </div>
      </div>
    );
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const SearchBar = () => {
    return (
      <div className="search-bar-overlay">
        <div className="search-bar-container" ref={dropdownRef}>
          <div className="search-field">
            <label>Điểm đến</label>
            <input
              type="text"
              placeholder="Nhập điểm đến"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onClick={handleInputClick}
            />
            {isDropdownOpen && (
              <div className="dropdown-container">
                <h4 className="dropdown-header">Popular nearby destinations</h4>
                <ul className="dropdown-list">
                  {popularDestinations.map((dest, index) => (
                    <li
                      key={index}
                      className="dropdown-item"
                      onClick={() => handleSelectDestination(dest.name)}
                    >
                      <FaMapMarkerAlt className="dropdown-icon" />
                      <div className="dropdown-text">
                        <span className="dropdown-name">{dest.name}</span>
                        <span className="dropdown-country">{dest.country}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="search-field">
            <label>Ngày đi</label>
            <input type="date" />
          </div>
          <div className="search-field">
            <label>Ngày đến</label>
            <input type="date" />
          </div>
          <div className="search-field">
            <label>Ngân sách (VND)</label>
            <input type="number" placeholder="Nhập ngân sách" />
          </div>
          <button className="search-btn" aria-label="Tìm kiếm">
            <FaSearch />
          </button>
        </div>
      </div>
    );
  };
  const ThreeImages = () => {
    return (
      <div className="three-container">
        <img src={three1} alt="" />
        <img src={three2} alt="" />
        <img src={three3} alt="" />
      </div>
    );
  };
  const Posts = () => {
    return (
      <div className="posts-container">
        <h1>KHÁM PHÁ BÀI VIẾT</h1>
        <p>
          Hãy tận hưởng trải nghiệm du lịch chuyên nghiệp, mang lại cho bạn
          những khoảnh khắc tuyệt vời và nâng tầm cuộc sống. Chúng tôi cam kết
          mang đến những chuyến đi đáng nhớ, giúp bạn khám phá thế giới theo
          cách hoàn hảo nhất.
        </p>
        <div className="post-list">
          {fourPosts.map((post) => (
            <div key={post.id} className="post-card">
              <img
                src={fixDriveUrl(post.imgUrl)}
                alt={post.title}
                className="post-image"
              />
              <div className="post-overlay">
                <h2 className="post-title">{post.title}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  function formatDateTime(dateString) {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "Invalid date";

    const pad = (n) => n.toString().padStart(2, "0");

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();

    return `${day}/${month}/${year} `;
  }

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
  const Tours = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const visibleCount = 3.5;
    const maxIndex = tourData.length - Math.floor(visibleCount);

    const handleNext = () => {
      setCurrentIndex((prev) => (prev + 1 > maxIndex ? 0 : prev + 1));
    };

    const handlePrev = () => {
      setCurrentIndex((prev) => (prev - 1 < 0 ? maxIndex : prev - 1));
    };
    return (
      <div className="tours-container">
        <h1>KHÁM PHÁ TOUR</h1>
        <p>Chọn lựa tour yêu thích và trải nghiệm hành trình tuyệt vời!</p>

        <div
          className="tour-list-wrapper"
          style={{ display: "flex", alignItems: "center" }}
        >
          <button
            onClick={handlePrev}
            className="prev-btn"
            aria-label="Xem tour trước đó"
          >
            ←
          </button>

          <div
            className="tour-list"
            style={{
              overflow: "hidden",
              width: "1250px", // 3.5 cards × 340px + 3 gaps × 20px
            }}
          >
            <div
              className="tour-inner"
              style={{
                display: "flex",
                gap: "20px",
                transition: "transform 0.5s ease",
                transform: `translateX(-${currentIndex * 360}px)`, // 340px card + 20px gap
              }}
            >
              {tourData.map((tour, index) => {
                const halfVisibleIndex =
                  currentIndex + Math.floor(visibleCount);
                const isHalfVisible = index === halfVisibleIndex;

                return (
                  <div
                    key={tour.tourId}
                    className={`tour-card ${isHalfVisible ? "half" : ""}`}
                  >
                    <img
                      src={tour.image}
                      alt={tour.name}
                      className="tour-img"
                      loading="lazy"
                    />
                    <div className="tour-info" style={{ paddingTop: "8px" }}>
                      <h2>{tour.tourName}</h2>
                      <p>
                        <FaCalendarAlt
                          style={{ marginRight: "6px", color: "#0b5da7" }}
                        />
                        Ngày khởi hành:{" "}
                        {formatDateTime(tour.nextDeparture?.departureDate)}
                      </p>
                      <p>
                        <FaClock
                          style={{ marginRight: "6px", color: "#0b5da7" }}
                        />
                        Thời gian: {tour.durationDays}
                      </p>
                      <p>
                        <FaBus
                          style={{ marginRight: "6px", color: "#0b5da7" }}
                        />
                        Phương tiện: {tour.vehicle}
                      </p>
                      <p className="price-container">
                        Giá từ:{" "}
                        <span className="price">{formatVND(tour.price)}</span>
                      </p>
                      <button
                        className="book-btn"
                        onClick={() => {
                          navigate(`/tour/tour-detail/${tour.tourId}`);
                          console.log(tour.tourId);
                        }}
                      >
                        Đặt ngay
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleNext}
            className="next-btn"
            aria-label="Xem tour tiếp theo"
          >
            →
          </button>
        </div>
        <button
          className="see-all"
          onClick={() => {
            navigate("/tours");
          }}
        >
          Xem tất cả
        </button>
      </div>
    );
  };
  if (loading) return <div>Đang tải...</div>;
  return (
    <div>
      <Header
        onLoginClick={() => setShowPopup(true)}
        onRegisterClick={() => setShowPopup(true)}
      />
      {showPopup && <LoginRegisterPopup onClose={() => setShowPopup(false)} />}
      {showPromoPopup && (
        <PromoPopup onClose={() => setShowPromoPopup(false)} />
      )}
      <ImageBanner />
      <SearchBar />
      <ThreeImages></ThreeImages>
      <Posts></Posts>
      <Tours></Tours>
      <Footer></Footer>
    </div>
  );
}

export default Home;
