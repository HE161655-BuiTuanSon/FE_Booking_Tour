import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Admin/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const sections = [
    { title: "Manage Tour", path: "/admin/tours" },
    { title: "Manage Product", path: "/admin/products" },
    { title: "Manage Post", path: "/admin/posts" },
    { title: "Manage Destination", path: "/admin/destinations" },
    { title: "Manage Departure Point", path: "/admin/departure-points" },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <div className="dashboard-grid">
        {sections.map((section) => (
          <div
            key={section.title}
            className="dashboard-card"
            onClick={() => navigate(section.path)}
          >
            <h2>{section.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
