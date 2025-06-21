import React, { useEffect, useState } from "react";
import LoginRegisterPopup from "../../components/authorization/LoginRegisterPopup";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { getTourById } from "../../services/Client/TourService";
import "../../styles/Client/Booking.css";
import Header from "../../components/header/Header";
import qr from "../../assets/qrPayment.jpg";
function Booking(props) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { tourId } = useParams();
  const [searchParams] = useSearchParams();
  const departureId = searchParams.get("departureId");
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [tourData, setTourData] = useState(null);
  const [participants, setParticipants] = useState(1);
  const [orderCode, setOrderCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departureDateText, setDepartureDateText] = useState("");
  const userId = localStorage.getItem("userId");
  const [availableSlots, setAvailableSlots] = useState(0);
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (userId && role === "2") {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
      setShowLoginPopup(true);
    }
  }, []);
  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await getTourById(tourId);
        setTourData(res);
        setOrderCode(
          "ORDER" + crypto.randomUUID().replace(/-/g, "").slice(0, 12)
        );
        const selectedDeparture = res.departureDates.find(
          (d) => d.departureId === parseInt(departureId)
        );
        if (selectedDeparture) {
          setDepartureDateText(
            new Date(selectedDeparture.departureDate).toLocaleDateString(
              "vi-VN"
            )
          );
          setAvailableSlots(selectedDeparture.availableSlots);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin tour:", error);
      }
    };

    if (tourId) fetchTour();
  }, [tourId]);
  useEffect(() => {
    if (tourData && tourData.departureDates) {
      const matchedDate = tourData.departureDates.find(
        (d) => d.departureId.toString() === departureId
      );
      if (matchedDate) {
        const formatted = new Date(
          matchedDate.departureDate
        ).toLocaleDateString("vi-VN");
        setDepartureDateText(formatted);
      } else {
        setDepartureDateText("Không rõ");
      }
    }
  }, [tourData, departureId]);
  const handleSubmitBooking = async () => {
    try {
      setIsSubmitting(true);
      await axios.post("https://localhost:44338/api/Bookings", {
        tourId,
        userId,
        numberOfParticipants: participants,
        bankAccountId: 0,
        departureId: parseInt(departureId),
      });

      Swal.fire("Thành công", "Bạn đã đặt tour thành công!", "success");
    } catch (error) {
      console.error("Lỗi khi đặt tour:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Không thể đặt tour. Vui lòng thử lại!";

      Swal.fire("Lỗi", errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!isAuthorized) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2 style={{ display: "none" }}>
          Bạn cần đăng nhập để tiếp tục đặt tour
        </h2>
        {showLoginPopup && (
          <LoginRegisterPopup onClose={() => setShowLoginPopup(false)} />
        )}
      </div>
    );
  }
  return (
    <div className="">
      <Header />
      <div className="booking-layout">
        <div className="booking-table-section">
          <h2>Thông tin đặt tour</h2>
          <table className="booking-table">
            <thead>
              <tr>
                <th>Mã tour</th>
                <th>Tên tour</th>
                <th>Ngày khởi hành</th>
                <th>Số người</th>
                <th>Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{tourId}</td>
                <td>{tourData?.tourName}</td>
                <td>{departureDateText || "Đang tải..."}</td>
                <td>
                  <input
                    type="number"
                    value={participants}
                    min={1}
                    max={availableSlots}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val > availableSlots) {
                        Swal.fire(
                          "Thông báo",
                          `Chỉ còn ${availableSlots} chỗ trống.`,
                          "warning"
                        ).then(() => {
                          setParticipants(availableSlots);
                        });
                      } else if (val < 1 || isNaN(val)) {
                        setParticipants(1);
                      } else {
                        setParticipants(val);
                      }
                    }}
                  />
                </td>
                <td>
                  {(tourData?.price * participants).toLocaleString("vi-VN")} VND
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="booking-sidebar">
          <h3>Thanh toán</h3>
          <img src={qr} alt="QR thanh toán" className="qr-img" />
          <p>
            <strong>Nội dung chuyển khoản:</strong>
            <br />
            <code>{orderCode}</code>
          </p>
          <button
            className="confirm-button"
            onClick={handleSubmitBooking}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt tour"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Booking;
