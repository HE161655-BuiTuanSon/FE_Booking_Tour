import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Admin/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  if (role !== "1") {
    navigate("/");
  }
  const sections = [
    { title: "Manage Tour", path: "/manage-tour" },
    { title: "Manage Product", path: "/manage-shop" },
    { title: "Manage Post", path: "/manage-post" },
    { title: "Manage Destination", path: "/manage-destination" },
    { title: "Manage Departure Point", path: "/manage-departure-point" },
    { title: "Manage Tour Categories", path: "/manage-tour-category" },
    { title: "Manage Transpost Method", path: "/manage-method" },
    { title: "List Reviews", path: "/list-reviews" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/loginadmin");
  };

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
        <div className="dashboard-card logout-card" onClick={handleLogout}>
          <h2>Logout</h2>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
