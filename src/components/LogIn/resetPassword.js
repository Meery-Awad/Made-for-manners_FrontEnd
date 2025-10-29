import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useBetween } from "use-between";
import { useSelector } from "react-redux";
import "./resetPassword.scss";

const ResetPassword = () => {
  const state = useSelector((state) => state.data);
  const { serverUrl } = useBetween(state.useShareState);
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        `${serverUrl}/api/users/reset-password/${token}`,
        { password, confirmPassword }
      );
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-card">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <label>New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
          />
          <button type="submit">Reset Password</button>
          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;