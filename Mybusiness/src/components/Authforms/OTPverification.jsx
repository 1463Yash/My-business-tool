import { useState,useRef } from "react"
import Lottie from "lottie-react";
import successAnim from "../../../animation/success.json";
import invalidAnim from "../../../animation/invalid.json";
import "./OTPverification.css";
import "./Authfrom";

export default function OTPverification({OTP}) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputsRef = useRef([]);
  const [verify,setVerify]=useState(null);
  const [showinput,setShow]=useState(true);
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

  const handleverify=()=>{
    setShow(false);
    const enterotp=otp.join("");
    if(enterotp===String(OTP)){
      setVerify("valid");
    }
    else{
      setVerify("invalid");
    }
    console.log("Entered otp ",otp.join(""));
    console.log("Orginal OTP",OTP);
  };

  return (<>
    {showinput && <>
    <div className="otp-container">
      {otp.map((data, i) => (
        <input
          key={i}
          type="text"
          maxLength="1"
          value={data}
          required
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          ref={(el) => (inputsRef.current[i] = el)}
          className="otp-input"
        />
      ))}
      </div>
      <button   className="valideOTP-btn" disabled={otp.join("").length !== 6} onClick={handleverify}>Verify OTP</button>
    </>}

    {verify=="valid"?<><div style={{ width: "150px", margin: "auto" }}>
      <Lottie 
        animationData={successAnim} 
        loop={false}        
        autoplay={true} 
      />
    </div></>:<></>}

    {verify=="invalid"?
    <><div style={{ width: "150px", margin: "auto" }}>
      <Lottie 
        animationData={invalidAnim} 
        loop={false}        
        autoplay={true} 
      />
    </div> </>:<></>
      
  }

      {/* <div style={{ width: "150px", margin: "auto" }}>
      <Lottie 
        animationData={successAnim} 
        loop={false}        
        autoplay={true} 
      />
    </div>

    <div style={{ width: "150px", margin: "auto" }}>
      <Lottie 
        animationData={invalidAnim} 
        loop={false}        
        autoplay={true} 
      />
    </div> */}
      </>
  )
}