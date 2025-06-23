import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import aboutBanner from "../../assets/about_banner.jpg";
import Footer from "../../components/footer/Footer";
import LoginRegisterPopup from "../../components/authorization/LoginRegisterPopup";
import { getTourBooked } from "../../services/Client/TourService";
import { useNavigate } from "react-router-dom";
import { FaIdBadge, FaUserFriends, FaCalendarAlt, FaMoneyBillWave, FaCheckCircle, FaClock, FaBan } from 'react-icons/fa';
import "../../styles/Client/TourBooked.css";

function BookedTour() {
  const [showPopup, setShowPopup] = useState(false);
  const [tourBooked, setTourBooked] = useState([]);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatVND = (number) => {
    if (!number) return '0 VND';
    return Number(number).toLocaleString('vi-VN') + ' VND';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'green-bg';
      case 'Pending':
        return 'yellow-bg';
      case 'Cancelled':
        return 'red-bg';
      default:
        return 'gray-bg';
    }
  };

  useEffect(() => {
    const fetchTourBooked = async () => {
      try {
        const response = await getTourBooked(userId);
        if (response.status === 'success' && Array.isArray(response.data)) {
          setTourBooked(response.data);
        } else {
          setTourBooked([]);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách tour đã đặt:', error);
        setTourBooked([]);
      }
    };
    if (userId) {
      fetchTourBooked();
    }
  }, [userId]);

  return (
      <div className="booked-tour-page">
        <Header
            onLoginClick={() => setShowPopup(true)}
            onRegisterClick={() => setShowPopup(true)}
        />
        {showPopup && <LoginRegisterPopup onClose={() => setShowPopup(false)} />}

        <div className="banner">
          <div className="banner-overlay" style={{ backgroundImage: `url(${aboutBanner})` }}>
            <div className="banner-content">
              <h1>Lịch Sử Đặt Tour</h1>
            </div>
          </div>
        </div>

        <div className="container">
          {tourBooked.length === 0 ? (
              <div className="no-tours">
                <p>Bạn chưa đặt tour nào.</p>
                <p>Hãy khám phá và đặt tour ngay hôm nay!</p>
              </div>
          ) : (
              <div className="tour-grid">
                {tourBooked.map((booking) => (
                    <div key={booking.bookingId} className="tour-card">
                      <div className="card-content">
                        <div className="card-header">
                          <h2>{booking.tourName}</h2>
                          <span className={`status ${getStatusColor(booking.status)}`}>
                      {booking.status === 'Confirmed' && <FaCheckCircle />}
                            {booking.status === 'Pending' && <FaClock />}
                            {booking.status === 'Cancelled' && <FaBan />}
                            {booking.status}
                    </span>
                        </div>

                        <div className="tour-info">
                          <p><FaIdBadge /> <span>Mã đặt tour:</span> {booking.bookingId}</p>
                          <p><FaCalendarAlt /> <span>Ngày đặt:</span> {formatDate(booking.bookingDate)}</p>
                          <p><FaUserFriends /> <span>Số người:</span> {booking.numberOfParticipants}</p>
                          <p><FaMoneyBillWave /> <span>Tổng tiền:</span> {formatVND(booking.totalAmount)}</p>
                        </div>

                        <div className="payment-info">
                          <h3>Thông tin thanh toán:</h3>
                          <p><FaCheckCircle /> <span>Trạng thái:</span> <span className={getStatusColor(booking.payment.paymentStatus)}>{booking.payment.paymentStatus}</span></p>
                          <p><FaClock /> <span>Ngày thanh toán:</span> {formatDate(booking.payment.paymentDate)}</p>
                          {booking.payment.transactionId && (
                              <p><FaIdBadge /> <span>Mã giao dịch:</span> {booking.payment.transactionId}</p>
                          )}
                        </div>

                        <div className="card-actions">
                          <button onClick={() => navigate(`/tour/tour-detail/${booking.tourId}`)}>Xem chi tiết tour</button>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>

        <Footer />
      </div>
  );
}

export default BookedTour;