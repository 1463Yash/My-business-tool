import React, { useState } from "react";
import { Mail, X, Lock } from "lucide-react";
import "./Auth.css";
import OTPverification from "./OTPverification";
import Passwordconfirme from "./Passwordconfirme";
export default function Authfrom({ onClose }) {
  const [signin, setSignin] = useState({ email: "", password: "" });

  const [signup, setSignup] = useState({ email: "" });

  const [emailforget, setEmailforget] = useState({ email: "" });

  const [show, setShow] = useState(false);

  const [forget, setForget] = useState(false);

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

  return (
    <div className="main-form">
      <div className="close-btn" onClick={onClose}>
        <X />
      </div>
      <div className="header-top">
        <h1 className="signin-heading--fancy" onClick={handleClose}>
          Sign in
        </h1>
        <h1 className="signin-heading--fancy" onClick={handleOpen}>
          Sign Up
        </h1>
      </div>

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
                ? (e) => setEmailforget({ ...emailforget, email: e.target.value })
                : (e) => setSignup({ ...signup, email: e.target.value })
            }
            className="input-text"
          />
          <button className="sign-btn">
            {forget ? "Send OTP" : "Sign Up"}
          </button>
        </>
      )}
    </div>
  );
}
