// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import img from "../imgs/pizza3.jpg"
import { toast } from "react-toastify";
import { FaChevronRight } from "react-icons/fa";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post( `${process.env.REACT_APP_URL}/auth/forgot`, { email });
      toast.success(res.data.message);
    } catch (err) {
      toast.error("Something went wrong, try again.");
    }
  };

  return (

    <>
      <div className='login_main position-relative DALJU' style={{ height: '100vh', width: '100%' }}>
            <img src={img} alt='background_login' className='background_login_img img-fluid' style={{height: '100vh', width: '100%', objectFit: 'cover'}}/>
            <div className='login_form '
              >
              <h1 style={{fontSize:"30px",fontWeight:"bold",color:"blue",textAlign:"center"}}>Forgot Password</h1>
              <form onSubmit={handleSubmit}  style={{display:"flex",flexDirection:"column",gap:"20px"}}>
                <div className="userInputBox">
                  <input type="text" id="email" name="email"
                  value={email}
       onChange={(e) => setEmail(e.target.value)} required  />
                  <label htmlFor="email">Enter Your Email</label>
                </div>
              
               
                <div style={{padding:"5px",width:"100%",backgroundColor:"blue",borderRadius:"60px",height:"55px",display:"flex",justifyContent:"center",alignItems:"center"}}>
                  <button type="submit" className='text-white' style={{border:"none",backgroundColor:"transparent",width:"100%",height:"100%",fontSize:"19px",fontWeight:"bold"}}>Send Reset Link</button> 
                  <div style={{height:"50px",aspectRatio:"1",backgroundColor:"white",borderRadius:"50%"}} className='CR DALJU'>
                    <FaChevronRight style={{color:"blue"}}/>
                  </div>
                </div>
                <div style={{height:"45px",width:"100%",borderRadius:"60px",backgroundColor:"lightgray"}} className='DALJU'> 
                  <p className='text-center m-0 p-0' style={{fontSize:"14px",color:"blue"}}>Have an account? <a href="/login" className='text-decoration-none' style={{color:"blue"}}>Login</a></p>
                </div>
              </form>
            </div>
          </div>
    </>
    
  );
}
