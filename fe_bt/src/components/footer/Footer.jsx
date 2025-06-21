import React from "react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

import "./Footer.css";

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-a">
        <h3>Du lịch</h3>
        <div className="diem-den">
          <div className="diem-den-1">
            <p style={{ margin: "0" }}>Hà Nội</p>
            <p style={{ margin: "0" }}>Hạ Long</p>
            <p style={{ margin: "0" }}>Đà Nẵng</p>
            <p style={{ margin: "0" }}>Nha Trang</p>
            <p style={{ margin: "0" }}>Phú Quốc</p>
            <p style={{ margin: "0" }}>Phan Thiết</p>
            <p style={{ margin: "0" }}>Quy Nhơn</p>
          </div>
          <div className="diem-den-2">
            <p style={{ margin: "0" }}>Huế</p>
            <p style={{ margin: "0" }}>Quảng Bình</p>
            <p style={{ margin: "0" }}>Nghệ An</p>
            <p style={{ margin: "0" }}>Hồ Chí Minh</p>
            <p style={{ margin: "0" }}>Kiên Giang</p>
            <p style={{ margin: "0" }}>Cát Bà</p>
            <p style={{ margin: "0" }}>Côn Đảo</p>
          </div>
        </div>
      </div>
      <div className="footer-b">
        <h3>Chính sách</h3>
        <div className="info-footer">
          <p style={{ margin: "0" }}>Đặt tour & xác nhận </p>
          <p style={{ margin: "0" }}>Hoàn huỷ tour </p>
          <p style={{ margin: "0" }}>Bảo mật thông tin </p>
          <p style={{ margin: "0" }}>Thay đổi lịch trình </p>
          <p style={{ margin: "0" }}>Dành cho trẻ em & người cao tuổi </p>
          <p style={{ margin: "0" }}>Bảo hiểm du lịch </p>
          <p style={{ margin: "0" }}>Hỗ trợ & Khiếu nại </p>
        </div>
      </div>
      <div className="footer-c">
        <h3>Thông tin</h3>
        <div className="info-footer">
          <p style={{ margin: "0" }}>Chính sách riêng tư</p>
          <p style={{ margin: "0" }}>Tin tức</p>
          <p style={{ margin: "0" }}>Trợ giúp</p>
          <p style={{ margin: "0" }}>Thỏa thuận sử dụng</p>
          <p style={{ margin: "0" }}>Chính sách bảo vệ dữ liệu cá nhân</p>
        </div>
      </div>
      <div className="footer-d">
        <h3>Liên hệ</h3>
        <div className="social-icons">
          <a
            href="https://www.facebook.com/share/1AXztxcXvt/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.instagram.com/vivutraveltour?igsh=NnBjdHc1dnMxamdo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.tiktok.com/@vivutravel.tour?_t=ZS-8xMcy49OEAK&_r=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTiktok />
          </a>
        </div>
        <p style={{ marginTop: "10px" }}>
          Hotline:{" "}
          <a
            href="tel:0394627402"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            0394627402
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
