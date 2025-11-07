import React, { useState } from "react";
import { Mail, X,Lock } from "lucide-react";
import "./Auth.css";

export default function Signin({ onClose }) {
  const [signin, setSignin] = useState({ email: "", password: "" });

  const [signup, setSignup] = useState({ email: "" });

  const [show, setShow] = useState(false);

  const handleOpen = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
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
      {!show &&(<>
        <div className="box-icon"><Mail /></div>
         <input
        type="email"
        placeholder="Email"
        value={signin.email}
        onChange={(e) => setSignin({ ...signin, email: e.target.value })}
        className="input-text"
      />
      <div className="box-icon"><Lock/></div>
      <input
        type="password"
        placeholder="Password"
        value={signin.password}
        onChange={(e) => setSignin({ ...signin, password: e.target.value })}
        className="input-text"
      />

      <button className="sign-btn">Sign In</button>
      <a href="#" className="forget-pass">
        Forgot password?
      </a>
      </>)}


      {/* Signup portion */}

      {show && (
        <>
        <div className="box-icon"><Mail/></div>
          <input
            type="email"
            placeholder="Email"
            value={signup.email}
            onChange={(e) => setSignup({ ...signup, email: e.target.value })}
            className="input-text"
          />
          <button className="sign-btn">Sign Up</button>
        </>
      )}
    </div>
  );
}
