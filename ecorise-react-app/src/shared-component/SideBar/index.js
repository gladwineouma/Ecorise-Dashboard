import React from "react";
import {
  RiLayout4Fill,
  RiTruckFill,
  RiListCheck2,
  RiWallet3Fill,
  RiMessage3Fill,
  RiSettings3Fill,
  RiLogoutBoxRLine
} from 'react-icons/ri';
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./style.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Home", path: "/dashboard", icon: RiLayout4Fill },
    { name: "Pickups", path: "/pickup", icon: RiTruckFill },
    { name: "Inventory", path: "/material", icon: RiListCheck2 },
    { name: "Payments", path: "/payments", icon: RiWallet3Fill },
    { name: "Feedback", path: "/Feedback", icon: RiMessage3Fill },
    { name: "Settings", path: "/settings", icon: RiSettings3Fill },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      {/* HEADER SECTION */}
      <div className="sidebar-top">
        <div className="logo">
          <img src="/Images/company.png" alt="Ecorise Logo" />
          <div className="logo-text">
            <h2 className="bold-text">Ecorise</h2>
            <p className="regular-text">Recycling</p>
          </div>
        </div>
      </div>

      {/* MENU LIST */}
      <ul className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <li key={item.path} className={`menu-wrapper ${isActive ? "active" : ""}`}>
              <Link to={item.path} className="sidebar-item">
                <Icon className="icon" />
                <span>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* FOOTER */}
      <div className="settings">
        <div className="sidebar-item logout-item" onClick={handleLogout}>
          <RiLogoutBoxRLine className="icon" />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
