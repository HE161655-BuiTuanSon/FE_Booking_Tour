import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css";

function Header({ onLoginClick, onRegisterClick }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const fullName = localStorage.getItem("fullName");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="sticky-header">
      <div className="logo">MyLogo</div>

      <nav className="nav-links">
        <NavLink to="/" end>
          Trang chủ
        </NavLink>
        <NavLink to="/about">Về chúng tôi</NavLink>
        <NavLink to="/tours">Điểm đến</NavLink>
        <NavLink to="/posts">Bài viết</NavLink>
        {token && role === "2" && <NavLink to="/booked">Booked Tours</NavLink>}
        <NavLink to="/shop">Đồ lưu niệm</NavLink>
        <NavLink to="/contact">Liên hệ</NavLink>
      </nav>

      <div className="user-section">
        {!token || role !== "2" ? (
          <>
            <button onClick={onLoginClick} className="btn-login">
              Đăng nhập
            </button>
          </>
        ) : (
          <div className="user-info">
            <span>{fullName || "Người dùng"}</span>
            <button onClick={handleLogout} className="btn-logout">
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
