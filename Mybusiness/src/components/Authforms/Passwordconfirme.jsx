import React, { useState } from "react";
import "./Auth.css";
import { KeyRound } from "lucide-react";

export default function Passwordconfirme() {
  const [createpass, setPassword] = useState({ password: "" });
  const [confirme,setConfirm]=useState({confirmepass:""});
  return (
    <>
      <div className="box-icon">
        <KeyRound />
      </div>
      <input
        type="password"
        placeholder="Create Password"
        value={createpass.password}
        className="input-text"
        required="true"
        onChange={(e) =>
          setPassword({ ...createpass, password: e.target.value })
        }
      />
      <div className="box-icon">
        <KeyRound />
      </div>
      <input
        type="password"
        placeholder="Confirm Password"
        required="true"
        value={confirme.confirmepass}
        onChange={(e) =>
          setConfirm({ ...confirme, confirmepass: e.target.value })
        }
        className="input-text"
      />
      <button className="sign-btn">Submit</button>
    </>
  );
}
