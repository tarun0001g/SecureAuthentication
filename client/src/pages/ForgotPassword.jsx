import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";
import "./Auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const response = await forgotPassword({
      email,
    });

    alert(response.message);

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

        <h1>Forgot Password</h1>

        <p>Enter your registered email address.</p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit">
            {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;