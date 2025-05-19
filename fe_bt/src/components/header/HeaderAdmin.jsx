import React from "react";
import { NavLink } from "react-router-dom";

function HeaderAdmin(props) {
  return (
    <header className="sticky-header">
      <div className="logo">MyLogo</div>

      <nav className="nav-links">
        <NavLink to="/dashboard" end>
          Trang chủ
        </NavLink>
        <NavLink to="/manage-tours">Manage Tours</NavLink>
        <NavLink to="/manage-shop">Manage Shop</NavLink>
      </nav>

      <div className="user-section">
        <span className="username">Hi, User</span>
        <button className="logout-btn">Logout</button>
      </div>
    </header>
  );
}

export default HeaderAdmin;
