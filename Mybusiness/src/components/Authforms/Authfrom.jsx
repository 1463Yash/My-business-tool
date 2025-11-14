import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Mail, X, Lock, RefreshCw } from "lucide-react";
import "./Auth.css";
import OTPverification from "./OTPverification";
import Passwordconfirme from "./Passwordconfirme";
export default function Authfrom({ onClose }) {
  const [signin, setSignin] = useState({ email: "", password: "" });

  const [signup, setSignup] = useState({ email: "" });

  const [emailforget, setEmailforget] = useState({ email: "" });

  const [head, setHead] = useState(true);

  const [show, setShow] = useState(false);

  const [showin, setIn] = useState(true);

  const [showup, setUp] = useState(false);

  const [forget, setForget] = useState(false);

  const [exits, setexits] = useState(true);

  const [warn, setWarn] = useState(false);

  const [OTP, setOTP] = useState();

  const [OTPstatus, setOTPstatus] = useState();

  const [emilstatus, setEmailstatus] = useState();

  const [timeleft, setTimeleft] = useState(12);

  useEffect(() => {
    if (timeleft <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimeleft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeleft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleClose = () => {
    setIn(true);
    setForget(false);
    setUp(false);
  };

  const handleOpen = () => {
    setForget(false);
    setUp(true);
    setIn(false);
  };

  const handleforgetpassword = (e) => {
    setForget(true);
    setIn(false);
  };

  const handlerefresh = (e) => {
    setIn(true);
    setUp(false);
    setWarn(false);
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
        console.log("Email exitings ", Boolean(res.data.dbresults.exitsemail));
        console.log("OTP suceess ", res.data.OTPresults.success);
        console.log("OTP VALUE ", res.data.OTPresults.OTP);
        setOTP(res.data.OTPresults.OTP);
        setOTPstatus(res.data.OTPresults.success);
        setEmailstatus(res.data.dbresults.exitsemail);
        setexits(Boolean(value));
        setWarn(Boolean(value));

        if (exits) {
          setHead(false);
          setUp(false);
        }
      } catch (err) {
        console.log("Error in fetching Sign up data", err);
      }
    }
  };

  return (
    <div className="main-form">
      <div className="close-btn" onClick={onClose}>
        <X />
      </div>
      {head && (
        <div className="header-top">
          <h1 className="signin-heading--fancy" onClick={handleClose}>
            Sign in
          </h1>
          <h1 className="signin-heading--fancy" onClick={handleOpen}>
            Sign Up
          </h1>
        </div>
      )}

      {/* Signin portion */}
      {showin && (
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
      {showup && (
        <>
          <div className="warnning">Please enter valid email.</div>
          <div className="box-icon">
            <Mail />
          </div>
          <input
            type="email"
            placeholder="Email"
            value={signup.email}
            onChange={(e) => setSignup({ ...signup, email: e.target.value })}
            className="input-text"
          />
          <button className="sign-btn" onClick={handlesign}>
            Sign Up
          </button>
        </>
      )}

      {/* Forget password */}

      {forget && (
        <>
          <div className="forget-head">Forget Password?</div>
          <div className="box-icon">
            <Mail />
          </div>
          <input
            type="email"
            placeholder="Email"
            value={signup.email}
            onChange={(e) =>
              setEmailforget({ ...emailforget, email: e.target.value })
            }
            className="input-text"
          />
          <button className="sign-btn">Send OTP</button>
        </>
      )}

      {/* warnning portion and OTP sent message */}
      {warn ? (
        <>
          {" "}
          <div className="warnning2">
            This email is already exits.
            <br />
            Please Sign In.
          </div>
          <div className="refresh" onClick={handlerefresh}>
            <RefreshCw />
            Click here to signin
          </div>
        </>
      ) : (
        OTPstatus && (
          <>
            <div className="message">
              OTP sent successfully to your email {signup.email}.<br></br>
              <span style={{ color: "green" }}>Successfully...</span>
            </div>

            <div  className="time-div">
              <h2 className="time-head">OTP Timer: {formatTime(timeleft)}</h2>

              {timeleft === 0 && (
                <button className ="time-btn" onClick={() => setTimeleft(120)}>Resend OTP</button>
              )}
            </div>
          </>
        )
      )}
      {!exits && <OTPverification />}
    </div>
  );
}
