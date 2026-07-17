import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";
import "./Auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const response = await forgotPassword({ email });

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

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-mark">↺</div>
          <div>
            <h1 className="auth-title">Reset your password</h1>
            <p className="auth-subtitle">Enter your registered email to continue.</p>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-group">
            <label htmlFor="email">Email</label>
            <div className="auth-input-wrap">
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span className="auth-input-icon">✉</span>
            </div>
          </div>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Sending link..." : "Send reset link"}
          </button>
        </form>

        {message.text ? (
          <div className={`auth-message ${message.type}`}>{message.text}</div>
        ) : null}

        <div className="auth-link-row">
          <Link className="auth-link" to="/login">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;