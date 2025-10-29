import React from "react";
import "./CanceledPayment.scss";
import { useNavigate } from "react-router-dom";

const PaymentFailedPage = () => {

  const navigate = useNavigate();

  const onBack = () => navigate("/Courses");
  const onContact = () => navigate("/Contact us");

  return (
    <div className="payment-failed-page">
      <div className="card simple">
        <h2>Payment Failed</h2>
        <p>Your payment could not be completed. Please try again or contact us for support.</p>
        <div className="actions">
          <button onClick={onBack} className="back">
            Back to Courses
          </button>
          <button onClick={onContact} className="contact">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
