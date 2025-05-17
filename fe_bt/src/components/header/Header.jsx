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
        <NavLink to="/posts">Bài viết</NavLink>
        <NavLink to="/videos">Video</NavLink>
        <NavLink to="/shop">Cửa hàng</NavLink>
        <NavLink to="/contact">Liên hệ</NavLink>
      </nav>

      <div className="user-section"></div>
    </header>
  );
}

export default Header;
