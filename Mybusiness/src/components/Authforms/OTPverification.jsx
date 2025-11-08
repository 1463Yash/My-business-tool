import { useState,useRef } from "react"

import "./OTPverification.css";

export default function OTPverification() {
const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 5) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

   const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1].focus();
      }
    }
  };


  return (<>
    <div className="otp-container">
      {otp.map((data, i) => (
        <input
          key={i}
          type="text"
          maxLength="1"
          value={data}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          ref={(el) => (inputsRef.current[i] = el)}
          className="otp-input"
        />
      ))}
      </div>
      <button   className="valideOTP-btn" >Verify OTP</button>
      </>
  )
}
