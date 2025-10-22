import React, { useRef, useState } from 'react'
import { X } from 'lucide-react';

import "./Loginpage.css";
import axios from 'axios';
export default function Loginmail({onClose}) {
  const modelref=useRef();
  const closepopup=(e)=>{
    if(modelref.current === e.target){
      onClose();
    }
  }
  const[formEmail,setEmail]=useState({
    email:""
  });
  const handleChange=(e)=>{
    const{name,value}=e.target;
    setEmail((prev)=>({...prev,[name]:value}));  
  };

  const handleEmial=async()=>{
    try{
      const res=await axios.get("http://localhost:3000/loginpage",
        {params:{email:formEmail.email}
      });
      if(Number(res.data)==1){
        console.log("Email is already exits!")
      }
      else{
        console.log("Email does not exits!")
      }
      console.log(res.data);
     
    }
    catch(err){
      console.log(err);
    }
  };

  return (
    <div ref={modelref} onClick={closepopup} className="pop-mail-container">
      <button onClick={onClose} className='cross-btn'><X /></button>
      <h3 className='login-title'>
        Login/Register</h3>
      <div className='mail-input-field'>
        <input type="email" 
        name="email" 
        onChange={handleChange}
        value={formEmail.email}
        placeholder='Email..'/> 
      </div>

    <button className="Send-btn"
    
    onClick={handleEmial}
    disabled={formEmail.email.trim()===""}>Send</button>
    </div>
  )
}

 
