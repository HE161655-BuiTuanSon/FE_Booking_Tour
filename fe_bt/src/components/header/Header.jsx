import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css";

function Header({ onLoginClick, onRegisterClick }) {
  const token = localStorage.getItem("token");
  const fullName = localStorage.getItem("fullName");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <header className="sticky-header">
      <div className="logo">MyLogo</div>

      <nav className="nav-links">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/about">About Us</NavLink>
        <NavLink to="/tours">Tours</NavLink>
        <NavLink to="/posts">Posts</NavLink>
        {token && <NavLink to="/booked">Booked Tours</NavLink>}
        <NavLink to="/shop">Shop</NavLink>
        <NavLink to="/contact">Contacts</NavLink>
      </nav>

      <div className="user-section">
        {!token ? (
          <>
            <button onClick={onLoginClick} className="btn-login">
              Sign in
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
