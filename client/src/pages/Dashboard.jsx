import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../services/authService";
import "./Auth.css";

const Dashboard = () => {
  const { user, token, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const response = await updateProfile(token, formData);

      updateUser(response.data);
      setMessage({ type: "success", text: response.message });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  const initials = (user?.name || "User")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="auth-page">
      <div className="auth-dashboard">
        <div className="auth-dashboard-card auth-dashboard-card--welcome">
          <span className="auth-dashboard-badge">Secure Authentication</span>
          <h1 className="auth-dashboard-title">Welcome back, {user?.name || "there"}.</h1>
          <p className="auth-dashboard-copy">
            Your account is ready. Manage your profile details and keep your workspace secure.
          </p>

          <div className="auth-stat-grid">
            <div className="auth-stat">
              <span className="auth-stat-label">Member since</span>
              <span className="auth-stat-value">Today</span>
            </div>
            <div className="auth-stat">
              <span className="auth-stat-label">Status</span>
              <span className="auth-stat-value">Verified</span>
            </div>
          </div>
        </div>

        <div className="auth-dashboard-card">
          <div className="auth-profile-header">
            <div className="auth-profile-avatar">{initials}</div>
            <div>
              <h2 className="auth-dashboard-heading">Profile</h2>
              <p className="auth-subtitle">Update your details anytime.</p>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleUpdate}>
            <div className="auth-group">
              <label htmlFor="name">Name</label>
              <div className="auth-input-wrap">
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <span className="auth-input-icon">◔</span>
              </div>
            </div>

            <div className="auth-group">
              <label htmlFor="email">Email</label>
              <div className="auth-input-wrap">
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <span className="auth-input-icon">✉</span>
              </div>
            </div>

            <div className="auth-actions">
              <button className="auth-button" type="submit" disabled={loading}>
                {loading ? "Saving..." : "Update profile"}
              </button>
              <button
                className="auth-button auth-button--secondary"
                type="button"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </div>
          </form>

          {message.text ? (
            <div className={`auth-message ${message.type}`}>{message.text}</div>
          ) : null}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;