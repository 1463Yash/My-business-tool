import React, { useRef, useState } from "react";
import axios from "axios";
import { Mail, X, Lock, AlignRight, Binary } from "lucide-react";
import "./Auth.css";
import OTPverification from "./OTPverification";
import Passwordconfirme from "./Passwordconfirme";
export default function Authfrom({ onClose }) {

  const [signin, setSignin] = useState({ email: "", password: "" });

  const [signup, setSignup] = useState({ email: "" });

  const [emailforget, setEmailforget] = useState({ email: "" });

  const [head, setHead] = useState(true);

  const [show, setShow] = useState(false);

  const [forget, setForget] = useState(false);

  const [exits, setexits] = useState(true);

  const [warn, setWarn] = useState(false);

  const [OTP,setOTP]=useState();

  const [OTPstatus,setOTPstatus]=useState(false);

  const [emilstatus,setEmailstatus]=useState();


  const handleOpen = () => {
    setForget(false);
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };
  const handleforgetpassword = (e) => {
    setForget(true);
    setShow(true);
  };
  const handlesign = async () => {
    if (forget) {
      // Forget Password Portion
      alert("Forget Clicked");
    } else {
      // Sign Up Portion
      try {
        const res = await axios.get("http://localhost:3000/Signup", {
          params: { email: signup.email },
        });
        const value = res.data.dbresults.exitsemail;
        console.log("Email exitings ",Boolean(res.data.dbresults.exitsemail));
        console.log("OTP suceess ",res.data.OTPresults.success);
        console.log("OTP VALUE ",res.data.OTPresults.OTP);
        setOTP(res.data.OTPresults.OTP);
        setOTPstatus(res.data.OTPresults.success);
        setEmailstatus(res.data.dbresults.exitsemail);
        // console.log();
        // if()
        setexits(Boolean(value));
        setWarn(Boolean(value));
      } catch (err) {
        console.log("Error in fetching Sign up data", err);
      }
    }

    if(setOTPstatus){
      setHead(false);


    }
    

  };
  return (
    <div className="main-form">
      <div className="close-btn" onClick={onClose}>
        <X />
      </div>
      {head && (
        <div className="header-top">
          <h1 className="signin-heading--fancy"  onClick={handleClose}>
            Sign in
          </h1>
          <h1 className="signin-heading--fancy" onClick={handleOpen}>
            Sign Up
          </h1>
        </div>
      )}

      {/* Signin portion */}
      {!show && (
        <>
          <div className="box-icon">
            <Mail />
          </div>
          <input
            type="email"
            placeholder="Email"
            value={signin.email}
            onChange={(e) => setSignin({ ...signin, email: e.target.value })}
            className="input-text"
          />
          <div className="box-icon">
            <Lock />
          </div>
          <input
            type="password"
            placeholder="Password"
            value={signin.password}
            onChange={(e) => setSignin({ ...signin, password: e.target.value })}
            className="input-text"
          />

          <button className="sign-btn">Sign In</button>

          <a href="#" className="forget-pass" onClick={handleforgetpassword}>
            Forgot password?
          </a>
        </>
      )}

      {/* Signup portion */}

      {show && (
        <>
          {OTPstatus? <div className="warnning2">Please check your email for {signup.email}  for OTP.</div>:<div className="warnning">Please enter valid email.</div>}
          <div className="box-icon">
            <Mail />
          </div>
          {forget && <div className="forget-head">Forget Password?</div>}
          <input
            type="email"
            placeholder="Email"
            value={signup.email}
            onChange={
              forget
                ? (e) =>
                    setEmailforget({ ...emailforget, email: e.target.value })
                : (e) => setSignup({ ...signup, email: e.target.value })
            }
            className="input-text"
          />
          <button className="sign-btn" onClick={handlesign}>
            {forget ? "Send OTP" : "Sign Up"}
          </button>
        </>
      )}

      {warn && (
        <div className="warnning2">
          This email is already exits.
          <br />
          Please Sign In.
        </div>
      )}

      {!exits && <OTPverification />}
    </div>
  );
}
