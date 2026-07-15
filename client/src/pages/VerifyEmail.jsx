import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { verifyEmail } from "../services/authService";
import "./Auth.css";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("Verifying your email...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await verifyEmail(token);

        setMessage(response.message);

        setTimeout(() => {
          navigate("/login");
        }, 3000);

      } catch (error) {
        setMessage(
          error.response?.data?.message || "Verification failed."
        );
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1>Email Verification</h1>

        <p>{loading ? "Please wait..." : message}</p>

      </div>
    </div>
  );
};

export default VerifyEmail;