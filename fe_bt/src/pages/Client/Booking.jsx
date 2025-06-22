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
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
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
      const postResponse = await axios.post(
        "http://vivutravel.net/api/Bookings",
        {
          tourId,
          userId,
          numberOfParticipants: participants,
          bankAccountId: 1,
          departureId: parseInt(departureId),
        }
      );

      const bookingData = postResponse.data;
      const bookingId = bookingData.data.bookingId;
      console.log("postResponse.data", bookingData);

      if (!bookingId) {
        throw new Error("Không lấy được mã booking.");
      }
      console.log(bookingData);
      setPaymentInfo({
        bookingId,
        orderContent:
          bookingData.data.transferContent || `Thanh toan tour ${bookingId}`,
        amount: bookingData.totalAmount || tourData?.price * participants,
        qrCodeUrl: bookingData.qrCodeUrl || qr,
      });

      setShowPaymentPopup(true);
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
  const handleCheckPaymentStatus = async () => {
    try {
      setIsCheckingPayment(true);
      console.log("BookingId:", paymentInfo.bookingId);

      const res = await axios.get(
        `http://vivutravel.net/api/Bookings/bookings-status?bookingId=${paymentInfo.bookingId}`
      );

      const status = res.data?.status || "Unknown";
      setPaymentStatus(status); // để hiển thị dưới popup nếu cần

      switch (status) {
        case "Confirmed":
          Swal.fire("✅ Thành công", "Thanh toán đã được xác nhận!", "success");
          setShowPaymentPopup(false);
          break;

        case "Pending":
          Swal.fire(
            "⏳ Đang xử lý",
            "Thanh toán của bạn đang được kiểm tra. Vui lòng đợi vài phút.",
            "info"
          );
          break;

        case "Failed":
          Swal.fire(
            "❌ Chuyển khoản sai số tiền",
            "Vui lòng kiểm tra lại số tiền và nội dung chuyển khoản.",
            "error"
          );
          break;

        case "Cancelled":
          Swal.fire(
            "❌ Thanh toán quá hạn",
            "Thời gian chuyển khoản đã hết. Vui lòng đặt lại tour mới.",
            "warning"
          );
          break;

        default:
          Swal.fire(
            "⚠️ Không rõ trạng thái",
            "Vui lòng thử lại sau.",
            "question"
          );
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái thanh toán:", error);
      Swal.fire("Lỗi", "Không thể kiểm tra trạng thái thanh toán.", "error");
    } finally {
      setIsCheckingPayment(false);
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
          <div style={{ marginTop: "20px", textAlign: "right" }}>
            <button
              className="confirm-button"
              onClick={handleSubmitBooking}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt tour"}
            </button>
          </div>
        </div>

        {showPaymentPopup && paymentInfo && (
          <div className="payment-popup-overlay">
            <div className="payment-popup">
              <h3>Thông tin thanh toán</h3>
              <img
                src={paymentInfo.qrCodeUrl}
                alt="QR thanh toán"
                className="qr-img"
              />
              <p>
                <strong>Số tiền cần chuyển:</strong>{" "}
                {paymentInfo.amount.toLocaleString("vi-VN")} VND
              </p>
              <p>
                <strong>Nội dung chuyển khoản:</strong>
                <br />
                <code>{paymentInfo.orderContent}</code>
              </p>
              <p style={{ fontStyle: "italic", fontSize: "0.9rem" }}>
                Sau khi chuyển khoản, hệ thống sẽ xác nhận thanh toán trong vòng
                vài phút.
              </p>
              <button
                style={{ backgroundColor: "red" }}
                onClick={() => setShowPaymentPopup(false)}
                className="confirm-button"
              >
                Đóng
              </button>
              <button
                onClick={handleCheckPaymentStatus}
                className="confirm-button"
                disabled={isCheckingPayment}
                style={{
                  marginTop: "10px",
                  marginLeft: "10px",
                  backgroundColor: "#0d6efd",
                }}
              >
                {isCheckingPayment ? "Đang kiểm tra..." : "Tôi đã chuyển khoản"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Booking;
