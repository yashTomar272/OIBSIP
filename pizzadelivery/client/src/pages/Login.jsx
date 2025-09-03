import img from "../imgs/pizza3.jpg"
import { FaChevronRight } from "react-icons/fa";
import { PiEyeLight, PiEyeSlash } from "react-icons/pi";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {authActions} from "../store/auth";
import { useDispatch } from "react-redux";


const Login = () => {
  const [Show, setShow] = useState(true);
  const [values, setValues] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch=useDispatch();

  const handleShow = () => setShow(!Show);

  // input change handle
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!values.email || !values.password) {
        toast.error("All fields are required");
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_URL}/auth/login`,
        values
      );

      toast.success("Login successful ✅");

      // token ko localStorage me save karo
      dispatch(authActions.login());
    dispatch(authActions.changeRole(response.data.user.role));
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      console.log("hello",response.data)
      navigate("/"); // home page ya dashboard pe bhej do
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.response?.data?.message || "Login failed");
    }
  };
  return (
    <>
      <div className='login_main position-relative DALJU' style={{ height: '100vh', width: '100%' }}>
        <img src={img} alt='background_login' className='background_login_img img-fluid' style={{height: '100vh', width: '100%', objectFit: 'cover'}}/>
        <div className='login_form '
          >
          <h1 style={{fontSize:"30px",fontWeight:"bold",color:"blue",textAlign:"center"}}>Login</h1>
          <form onSubmit={handleSubmit}  style={{display:"flex",flexDirection:"column",gap:"20px"}}>
            <div className="userInputBox">
              <input type="text" id="email" name="email"
                value={values.email}
                onChange={handleChange} required  />
              <label htmlFor="email">Enter Your Email</label>
            </div>
            <div className="userInputBox">
                           <input  type={Show ? "password" : "text"}
                          id="password" name="password"
                value={values.password}
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
              <a href="/ForgotPassword" className='text-decoration-none ' style={{color:"blue",fontSize:"14px"}}>Forgot Password?</a>
            </div>
            <div style={{padding:"5px",width:"100%",backgroundColor:"blue",borderRadius:"60px",height:"55px",display:"flex",justifyContent:"center",alignItems:"center"}}>
              <button type="submit" className='text-white' style={{border:"none",backgroundColor:"transparent",width:"100%",height:"100%",fontSize:"19px",fontWeight:"bold"}}>Login</button> 
              <div style={{height:"50px",aspectRatio:"1",backgroundColor:"white",borderRadius:"50%"}} className='CR DALJU'>
                <FaChevronRight style={{color:"blue"}}/>
              </div>
            </div>
            <div style={{height:"45px",width:"100%",borderRadius:"60px",backgroundColor:"lightgray"}} className='DALJU'> 
              <p className='text-center m-0 p-0' style={{fontSize:"14px",color:"blue"}}>Don't have an account? <a href="/Signup" className='text-decoration-none' style={{color:"blue"}}>SignUp</a></p>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login