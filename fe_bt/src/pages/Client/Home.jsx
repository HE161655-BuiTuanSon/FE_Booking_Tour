import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { getAllTour, getTenTour } from "../../services/Client/TourService";
import { getAllDestination } from "../../services/Admin/CRUDDestination";
import RegionTabs from "../../components/Regiontab";
import axios from "axios";
import { FaMapSigns, FaMoneyBillAlt } from 'react-icons/fa';
function Home(props) {
  const [showPopup, setShowPopup] = useState(false);
  const [showPromoPopup, setShowPromoPopup] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [destination, setDestination] = useState("");
  const [destinations, setDestinations] = useState([]);
  const dropdownRef = useRef(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const navigate = useNavigate();
  const [fourPosts, setFourPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tourData, setTourData] = useState([]);
  const [destinationId, setDestinationId] = useState(null);
  const inputRef = useRef(null);
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
    const fetchDestinations = async () => {
      try {
        const data = await getAllDestination();
        setDestinations(data.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách điểm đến:", error);
      }
    };

    fetchDestinations();
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
  const handleSelectDestination = (destinationName, destinationId) => {
    setDestination(destinationName);
    setDestinationId(destinationId);
    setIsDropdownOpen(false);
  };
  const handleSearch = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...(destinationId && { destinationId: destinationId.toString() }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      }).toString();
      navigate(`/tours?${queryParams}`);
    } catch (err) {
      console.error("Lỗi khi tìm kiếm tour:", err);
    }
  };
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
  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const SearchBar = ({ onSearch }) => {
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
                  {destinations.map((dest) => (
                    <li
                      key={dest.destinationId}
                      className="dropdown-item"
                      onClick={() =>
                        handleSelectDestination(
                          dest.destinationName,
                          dest.destinationId
                        )
                      }
                    >
                      <FaMapMarkerAlt className="dropdown-icon" />
                      <div className="dropdown-text">
                        <span className="dropdown-name">
                          {dest.destinationName}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="search-field">
            <label>Ngày đi</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={getTodayDateString()}
            />
          </div>
          <div className="search-field">
            <label>Ngày về</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || getTodayDateString()}
            />
          </div>
          <button
            className="search-btn"
            aria-label="Tìm kiếm"
            onClick={handleSearch}
          >
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
  const ThreeTour = () => {
    const [threeTours, setThreeTours] = useState([]);
    useEffect(() => {
      const fetchThreeTour = async () => {
        try {
          const response = await axios.get('http://vivutravel.net/api/Home/random-tours');
          setThreeTours(response.data);
        } catch (error) {
          console.error('Lỗi khi lấy dữ liệu 3 tour:', error);
        }
      };

      fetchThreeTour();
    }, []);
    return (
      <div className="threeTour-container" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "30px", marginTop: "100px", backgroundColor: "#daefff", padding: "30px 0" }}>
        <h1 style={{ color: "#0b5da7" }}>Tour giá rẻ</h1>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap',
          }}
        >
          {threeTours.map((tour) => (
            <div
              key={tour.tourId}
              style={{
                width: '350px',
                height: '250px',
                perspective: '1000px',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.8s',
                }}
                className="flip-card-inner"
              >
                {/* Mặt trước */}
                <div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  className="flip-card-front"
                >
                  <div style={{ padding: '15px' }}>
                    <h3 style={{ marginTop: 0 }}>{tour.tourName}</h3>
                    <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FaClock /> <strong>Thời gian:</strong> {tour.durationDays}
                    </p>
                    <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FaMapMarkerAlt /> <strong>Điểm đến:</strong> {tour.destinationName}
                    </p>
                    <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FaMapSigns /> <strong>Khởi hành từ:</strong> {tour.departurePointName}
                    </p>
                    <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FaBus /> <strong>Phương tiện:</strong> {tour.vehicle}
                    </p>
                  </div>

                  <div style={{ padding: '0 15px 15px 15px' }}>
                    <p
                      style={{
                        margin: 0,
                        color: 'red',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: "large"
                      }}
                    >
                      <strong>Giá:</strong> {tour.price.toLocaleString()}₫
                    </p>
                  </div>
                </div>

                {/* Mặt sau */}
                <div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    backgroundImage: `url(${fixDriveUrl(tour.imageUrl)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  className="flip-card-back"
                >
                  {/* Lớp phủ mờ đen */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      borderRadius: '10px',
                      zIndex: 1,
                    }}
                  ></div>

                  {/* Nút ở giữa */}
                  <button
                    style={{
                      backgroundColor: '#0b5da7',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '5px',
                      padding: '10px 20px',
                      fontWeight: 'bold',
                      zIndex: 2,
                    }}
                    onClick={() => navigate(`/tour/tour-detail/${tour.tourId}`)}
                  >
                    Xem chi tiết
                
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
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
            <div key={post.articleId} className="post-card" onClick={() => navigate(`/posts/post-detail/${post.articleId}`)}>
              <img
                src={fixDriveUrl(post.imageUrl)}
                alt={post.title}
                className="post-image-home"
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
                      src={fixDriveUrl(tour.imageUrl)}
                      alt={tour.name}
                      className="tour-img"
                      loading="lazy"
                    />
                    <div className="tour-info" style={{ paddingTop: "8px" }}>
                      <h2 className="tourNameTitle">{tour.tourName}</h2>
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
      {/* <ThreeImages></ThreeImages> */}
      <ThreeTour></ThreeTour>
      <Posts></Posts>
      <Tours></Tours>
      <RegionTabs></RegionTabs>
      <Footer></Footer>
    </div>
  );
}

export default Home;
