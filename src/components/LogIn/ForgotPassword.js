import React, { useState } from "react";
import axios from "axios";
import "./ForgotPassword.scss";
import { useBetween } from "use-between";
import { useSelector } from "react-redux";

const ForgotPassword = () => {
  const state = useSelector((state) => state.data);
  const { serverUrl , setLoading } = useBetween(state.useShareState);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true)
    try {
      const res = await axios.post(`${serverUrl}/api/users/forgot-password`, { email });
      setMessage(res.data.message);
      setLoading(false)
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setLoading(false)
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-card">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
          <button type="submit">Send Reset Link</button>

          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
