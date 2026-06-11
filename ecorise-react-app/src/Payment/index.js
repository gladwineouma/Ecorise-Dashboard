import React, { useState } from 'react';
import { useStkPush } from '../hooks/useStkPush';
import './style.css';

const PaymentForm = () => {
  const [form, setForm] = useState({
    phoneNumber: '',
    amount: '',
    accountReference: '',
    transactionDesc: ''
  });

  const { initiatePayment, loading, error, data } = useStkPush();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await initiatePayment(form);
  };

  return (
    <div className="feedback-main-container">
      {/* 🌟 Uniform card container styling built-in */}
      <div className="feedback-table-container payment-card-wrapper">

        {/* TOP HEADER BAR: Matching text lines */}
        <div className="feedback-header-bar">
          <h1 className="feedback-title">Ecorise Payment Platform</h1>
        </div>

        {/* MIDDLE FORM AREA */}
        <form onSubmit={handleSubmit} className="payment-form-content">
          <div className="form-grid-layout">
            <label className="payment-label">
              Phone Number
              <input
                name="phoneNumber"
                type="tel"
                placeholder="e.g. 0712345678"
                value={form.phoneNumber}
                onChange={handleChange}
                required
              />
            </label>

            <label className="payment-label">
              Amount (Kshs)
              <input
                name="amount"
                type="number"
                placeholder="Enter amount"
                value={form.amount}
                onChange={handleChange}
                required
                min="1"
              />
            </label>

            <label className="payment-label">
              Account Reference
              <input
                name="accountReference"
                type="text"
                placeholder="e.g. Ref-123"
                value={form.accountReference}
                onChange={handleChange}
                required
              />
            </label>

            <label className="payment-label">
              Transaction Description
              <textarea
                name="transactionDesc"
                placeholder="Describe the transaction..."
                value={form.transactionDesc}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          {/* ACTION FOOTER ELEMENTS */}
          <div className="payment-action-row">
            <button type="submit" disabled={loading} className="material-btn">
              {loading ? 'Processing...' : 'Pay Now'}
            </button>

            {error && <p className="error-message">{error}</p>}
            {data && <p className="success-message">Payment initiated successfully!</p>}
          </div>
        </form>

      </div>
    </div>
  );
};

export default PaymentForm;
