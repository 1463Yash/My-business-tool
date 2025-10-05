import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./PayDuesPopup.css";

function PayDuesPopup({ open, onClose, retaileId, onSubmit }) {
  const [duesForm, setDues] = useState({
    id:"",
    date: new Date().toISOString().split("T")[0],
    amount: "",
    comments: "",
    paymentMode: "Cash",
  });

  useEffect(() => {
    setDues((prev) => ({ ...prev, id: Id }));   
  }, [Id]);
  const handleChange = (e) => {
    setDues({ ...duesForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!duesForm.amount || duesForm.amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    onSubmit(duesForm);
    onClose();
  };

  return (
    <Popup open={open} onClose={onClose} modal nested>
      <div className="dues-popup-container">
        <h2 className="dues-title">Pay Dues</h2>

        <div className="dues-field">
          <label>Retailer ID:</label>
          <input type="text" value={Id} readOnly />
        </div>

        <div className="dues-field">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={duesForm.date}
            onChange={handleChange}
          />
        </div>

        <div className="dues-field">
          <label>Amount (₹):</label>
          <input
            type="number"
            name="amount"
            value={duesForm.amount}
            onChange={handleChange}
            placeholder="Enter amount"
          />
        </div>

        <div className="dues-field">
          <label>Comments:</label>
          <textarea
            name="comments"
            value={duesForm.comments}
            onChange={handleChange}
            placeholder="Optional note..."
          />
        </div>

        <div className="dues-field">
          <label>Payment Mode:</label>
          <select
            name="paymentMode"
            value={duesForm.paymentMode}
            onChange={handleChange}
          >
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Bank">Bank</option>
          </select>
        </div>

        <div className="dues-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="submit-btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </Popup>
  );
}

export default PayDuesPopup;
