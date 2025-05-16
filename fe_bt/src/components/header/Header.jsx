import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="sticky-header">
      <div className="logo">MyLogo</div>

      <nav className="nav-links">
        <NavLink to="/" end>
          Trang chủ
        </NavLink>
        <NavLink to="/about">Chúng tôi</NavLink>
        <NavLink to="/tours">Điểm đến</NavLink>
        <div className="nav-dropdown">
          <NavLink to="/posts" className="dropdown-toggle">
            Bài viết
          </NavLink>
          <div className="dropdown-menu">
            <NavLink to="/posts/news">Tin tức</NavLink>
            <NavLink to="/posts/review">Review</NavLink>
            <NavLink to="/posts/guides">Hướng dẫn</NavLink>
          </div>
        </div>
        <NavLink to="/videos">Video</NavLink>
        <NavLink to="/shop">Cửa hàng</NavLink>
        <NavLink to="/contact">Liên hệ</NavLink>
      </nav>

      <div className="user-section">
        <span className="username">Hi, User</span>
        <button className="logout-btn">Logout</button>
      </div>
    </header>
  );
}

export default Header;
