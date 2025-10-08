import React, { useState, useEffect } from "react";
import "reactjs-popup/dist/index.css";
import "./PayDuesPopup.css";
import axios from "axios";
import Vendors from "../Vendors";

export default function PayDuesPopup({
  onClose,
  userid,
  onSubmit,
  popupdata=[],
  type="retailer"
}) 

{
  const selectUsedata = popupdata.find((r) => r.id === userid);
  const seletedName = selectUsedata?.name || "";
  const currentdues=selectUsedata?.total_dues ||"";
  const [duesForm, setDues] = useState({
    id: seletedName,
    date: new Date().toISOString().split("T")[0],
    amount: "",
    comments: "",
    paymentMode: "Cash",
  });

  // Update ID if userid changes
  useEffect(() => {
    setDues((prev) => ({ ...prev, id: seletedName ? String(seletedName) : "" }));
  }, [seletedName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async() => {
    if (!duesForm.amount || duesForm.amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    if(duesForm.amount>currentdues){
      alert(`Entered dues is greater than current dues!`);
      return;
    }
    try{
        if(type=="retailer")
        {
          await axios.post("http://localhost:3000/retailers/paydues",{
            retailerid:userid,
            amount:duesForm.amount,
            date:duesForm.date,
            comments:duesForm.comments,
            paymentMode:duesForm.paymentMode
          });
        }
        else{
          await axios.post("http://localhost:3000/vendors/paydues",{
            vendorid:userid,
            amount:duesForm.amount,
            date:duesForm.date,
            comments:duesForm.comments,
            paymentMode:duesForm.paymentMode
          })
        }
        onClose();
        alert(`Suceessfull Submission!`)
        setDues({
          id:"",
          amount:"",
          date:"",
          comments:"",
          paymentMode:"Cash"
        })
    }
    catch(err){
      console.error("Error in Paydues",err);
    }
  };

  return (
    <div>
      <div className="dues-popup-container">
        <h2 className="dues-title">Pay Dues</h2>

        <div className="dues-field">
        <label>{type=="retailer" ?"Retailer":"Vendor"}</label>
          <input type="text" name="id" value={duesForm.id} readOnly />
        </div>

        <div className="dues-field">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={duesForm.date ?? ""}
            onChange={handleChange}
          />
        </div>

        <div className="dues-field">
          <label>Amount (₹):</label>
          <input
            type="number"
            name="amount"
            value={duesForm.amount ?? ""}
            onChange={handleChange}
            placeholder="Enter amount"
          />
        </div>

        <div className="dues-field">
          <label>Comments:</label>
          <textarea
            name="comments"
            value={duesForm.comments ?? ""}
            onChange={handleChange}
            placeholder="Optional note..."
          />
        </div>

        <div className="dues-field">
          <label>Payment Mode:</label>
          <select
            name="paymentMode"
            value={duesForm.paymentMode ?? ""}
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
    </div>
  );
}
