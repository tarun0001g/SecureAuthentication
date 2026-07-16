import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../services/authService";
import "./Auth.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Passwords must match
  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    setLoading(true);

    const response = await resetPassword(token, {
      password: formData.password,
    });

    alert(response.message);

    navigate("/login");

  } catch (error) {
    alert(
      error.response?.data?.message || "Something went wrong."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1>Reset Password</h1>

        <p>Enter your new password.</p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>New Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button type="submit">
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </form>

        <div className="links">
          <Link to="/login">
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;