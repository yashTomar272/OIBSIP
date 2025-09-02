import img from "../imgs/pizza3.jpg"
import { FaChevronRight } from "react-icons/fa";
import { PiEyeLight, PiEyeSlash } from "react-icons/pi";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Signup = () => {
  const [Show, setShow] = useState(true);
  const handleShow = () => {
    setShow(!Show);
  };
  const URL = process.env.REACT_APP_URL;
  console.log("URL",URL)

  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    email: "",
    address: "",
    password: ""
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (!values.name || !values.email || !values.address || !values.password) {
        toast.error("All fields are required");
        return;
      }

      const response = await axios.post(
        `${URL}/auth/register`,
        values
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <>
      <div className='login_main position-relative DALJU' style={{ height: '100vh', width: '100%' }}>
        <img src={img} alt='background_login' className='background_login_img img-fluid' style={{height: '100vh', width: '100%', objectFit: 'cover'}}/>
        <div className='login_form '
          >
          <h1 style={{fontSize:"30px",fontWeight:"bold",textAlign:"center"}} className='tt'>Register</h1>
          <form   style={{display:"flex",flexDirection:"column",gap:"14px"}} onSubmit={submit}>
            <div className="userInputBox">
              <input type="text" id="username" name="name"   value={values.name}
              onChange={handleChange} required  />
              <label htmlFor="username">Enter Your Username</label>
            </div>
            <div className="userInputBox">
              <input type="text" id="email" name="email"  value={values.email}
               onChange={handleChange} required  />
              <label htmlFor="email">Enter Your Email</label>
            </div>
            <div className="userInputBox">
              <input type="text" id="address" name="address"  value={values.address}
               onChange={handleChange} required  />
              <label htmlFor="address">Enter Address</label>
            </div>
             <div className="userInputBox">
                <input  type={Show ? "password" : "text"}
               id="password" name="password" value={values.password}
                onChange={handleChange} required 
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
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <a href="/forgot-password" className='text-decoration-none ' style={{color:"rgba(10, 196, 10, 1)",fontSize:"14px"}}>Forgot Password?</a>
            </div>
            <div style={{padding:"5px",width:"100%",backgroundColor:"rgb(49, 226, 49)",borderRadius:"60px",height:"55px",display:"flex",justifyContent:"center",alignItems:"center"}}>
              <button type="submit" className='text-white' style={{border:"none",backgroundColor:"transparent",width:"100%",height:"100%",fontSize:"19px",fontWeight:"bold"}}>Register</button> 
              <div style={{height:"50px",aspectRatio:"1",backgroundColor:"white",borderRadius:"50%"}} className='CR DALJU'>
                <FaChevronRight style={{color:"rgb(49, 226, 49)"}}/>
              </div>
            </div>
            <div style={{height:"45px",width:"100%",borderRadius:"60px",backgroundColor:"lightgray"}} className='DALJU'> 
              <p className='text-center m-0 p-0' style={{fontSize:"14px",color:"rgba(10, 196, 10, 1)"}}> Have an account? <a href="/login" className='text-decoration-none' style={{color:"blue"}}>LogIn</a></p>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Signup