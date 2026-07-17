import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { verifyEmail } from "../services/authService";
import "./Auth.css";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("Verifying your email...");
  const [loading, setLoading] = useState(true);
  const [statusType, setStatusType] = useState("success");

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await verifyEmail(token);

        setMessage(response.message);
        setStatusType("success");

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error) {
        setMessage(error.response?.data?.message || "Verification failed.");
        setStatusType("error");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [navigate, token]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-mark">✓</div>
          <div>
            <h1 className="auth-title">Email verification</h1>
            <p className="auth-subtitle">We’re confirming your account now.</p>
          </div>
        </div>

        <div className={`auth-message ${statusType}`}>{loading ? "Please wait while we verify your email." : message}</div>
      </div>
    </div>
  );
};

export default VerifyEmail;