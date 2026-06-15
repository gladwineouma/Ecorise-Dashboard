import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

export default function Teaser() {
  return (
    <div className="teaser-container">
      {/* Visual Asset Half */}
      <div className="teaser-image-side">
        <img
          src="/Images/clothe.png"
          alt="Pile of clothing"
          className="teaser-image"
        />
      </div>

      {/* Content Form Half */}
      <div className="teaser-content">
        <img
          src="/Images/logo.png"
          alt="Ecorise logo"
          className="teaser-logo"
        />

        <div className="teaser-text">
          <h1 className="teaser-heading">Welcome to Ecorise</h1>
          <h2 className="teaser-subheading">We connect you to the traders</h2>
        </div>

        <div className="teaser-buttons">
          <Link to="/login" className="teaser-btn teaser-btn-login">
            Login
          </Link>
          <Link to="/signup" className="teaser-btn teaser-btn-create">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
