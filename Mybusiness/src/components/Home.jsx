 import React, { useRef, useState } from 'react';
import { CircleUserRound } from 'lucide-react';
import Loginpage from "./Loginpage/Loginmail";

export default function Home() {
  const [openLogin, showLogin] = useState(false);
  const handleloginpopup=()=>{
    showLogin(true);
  }
  return (
    <div className='main-header'>
      <h2>HOME</h2>
      <CircleUserRound onClick={handleloginpopup} />
      {openLogin && (
        <Loginpage onClose={() => showLogin(false)} />
      )}
    </div>
  );  
}
