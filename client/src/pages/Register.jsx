import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import "./Auth.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const response = await registerUser(formData);

      setMessage({ type: "success", text: response.message });
      setTimeout(() => navigate("/login"), 650);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-mark">✦</div>
          <div>
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-subtitle">Join now and secure your workspace.</p>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-group">
            <label htmlFor="name">Name</label>
            <div className="auth-input-wrap">
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your name"
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
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              <span className="auth-input-icon">✉</span>
            </div>
          </div>

          <div className="auth-group">
            <label htmlFor="password">Password</label>
            <div className="auth-input-wrap">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              <span className="auth-input-icon">⎈</span>
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        {message.text ? (
          <div className={`auth-message ${message.type}`}>{message.text}</div>
        ) : null}

        <div className="auth-link-row">
          <Link className="auth-link" to="/login">
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;