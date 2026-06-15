import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { useUsers } from "../hooks/useFetchUsers";

const LoginScreen = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { data: users, loading, error: hookError } = useUsers();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = e => {
    e.preventDefault();
    setError("");
    if (loading) {
      setError("Please wait, loading...");
      return;
    }
    if (hookError) {
      setError("Error loading.... Please try again later.");
      return;
    }
    const user = users?.find(u => u.email === form.email);
    if (user && user.password === form.password) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      navigate("/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="login-container">
      {/* FIXED: Added inline background-image targeting the public folder asset */}
      <div
        className="login-image"
        style={{ backgroundImage: "url('/Images/clothe.png')" }}
      />
      <div className="login-form-section">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-title">Login</h2>
          {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
          <label className="login-label" htmlFor="email">Email</label>
          <div className="input-icon-wrapper">
            <MdEmail className="input-icon" />
            <input
              id="email"
              name="email"
              className="login-input"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>
          <label className="login-label" htmlFor="password">Password</label>
          <div className="input-icon-wrapper">
            <input
              id="password"
              name="password"
              className="login-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
            <span
              className="input-icon toggle-icon"
              onClick={() => setShowPassword(s => !s)}
              style={{ cursor: "pointer" }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
          <div className="login-links">
            <div className="signup-question">
              Don't have an account? <a href="/signup" className="signup-link">Sign Up</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
