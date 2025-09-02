// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { PiEyeLight, PiEyeSlash } from "react-icons/pi";
import img from "../imgs/pizza3.jpg"
import { toast } from "react-toastify";
import { FaChevronRight } from "react-icons/fa";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
const navigate=useNavigate()
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [Show, setShow] = useState(true);
  const handleShow = () => setShow(!Show);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_URL}/auth/reset`, {
        token,
        password,
      });
      toast.success(res.data.message);
      navigate("/login");
    } catch (err) {
      toast.error("Invalid or expired token");
    }
  };

  return (

    <>
     <div className='login_main position-relative DALJU' style={{ height: '100vh', width: '100%' }}>
                <img src={img} alt='background_login' className='background_login_img img-fluid' style={{height: '100vh', width: '100%', objectFit: 'cover'}}/>
                <div className='login_form '
                  >
                  <h1 style={{fontSize:"30px",fontWeight:"bold",color:"blue",textAlign:"center"}}>Reset Password</h1>
                  <form onSubmit={handleSubmit}  style={{display:"flex",flexDirection:"column",gap:"20px"}}>
                     <div className="userInputBox">
                                    <input  type={Show ? "password" : "text"}
                                   value={password}
                                    onChange={(e) => setPassword(e.target.value)} required 
                                    />
                                    <label htmlFor="password">Enter Password</label>
                                     {Show ? (
                                    <PiEyeSlash
                                      style={{
                                        position: "absolute",
                                        right: "20px",
                                        top: "8px",
                                        cursor: "pointer",
                                        fontSize: "23px",
                                        color:"white"
                                        
                                      }}
                                      onClick={handleShow}
                                    />
                                  ) : (
                                    <PiEyeLight
                                      style={{
                                        position: "absolute",
                                        right: "23px",
                                        top: "8px",
                                        cursor: "pointer",
                                        fontSize: "20px",
                                        color:"white"
                                        
                                        
                                      }}
                                      onClick={handleShow}
                                    />
                                  )}
                                  </div>
                                   <div className="userInputBox">
                                                  <input  type={Show ? "password" : "text"}
                                                 value={confirm}
                                                onChange={(e) => setConfirm(e.target.value)} required 
                                                  />
                                                  <label htmlFor="password">Confirm Password</label>
                                                   {Show ? (
                                                  <PiEyeSlash
                                                    style={{
                                                      position: "absolute",
                                                      right: "20px",
                                                      top: "8px",
                                                      cursor: "pointer",
                                                      fontSize: "23px",
                                                      color:"white"
                                                      
                                                    }}
                                                    onClick={handleShow}
                                                  />
                                                ) : (
                                                  <PiEyeLight
                                                    style={{
                                                      position: "absolute",
                                                      right: "23px",
                                                      top: "8px",
                                                      cursor: "pointer",
                                                      fontSize: "20px",
                                                      color:"white"
                                                      
                                                      
                                                    }}
                                                    onClick={handleShow}
                                                  />
                                                )}
                                                </div>
                   
                    <div style={{padding:"5px",width:"100%",backgroundColor:"blue",borderRadius:"60px",height:"55px",display:"flex",justifyContent:"center",alignItems:"center"}}>
                      <button type="submit" className='text-white' style={{border:"none",backgroundColor:"transparent",width:"100%",height:"100%",fontSize:"19px",fontWeight:"bold"}}>Reset Password</button> 
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
