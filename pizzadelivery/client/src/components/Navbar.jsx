import React, { useState } from 'react'
import { FaShoppingBag } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { HiOutlineBars3CenterLeft } from "react-icons/hi2";
import { ImCross } from "react-icons/im";
import {useNavigate} from "react-router-dom";

const Navbar = () => {
  const [Show,SetShow]=useState(false);
  const navigate=useNavigate()
  const handleShow = () => {
    SetShow(!Show);
  };
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1000 }}>
      {/* Navbar */}
      <div className="navbar display-flex justify-content-around align-items-center" 
        style={{ backgroundColor: '#333', padding: '10px', width: '100%' }}>
        
        <a className='navbar_brand text-white' href="/">PizzaHub</a>
<ul className="Nav_ul m-0 p-0 text-white d-none d-lg-flex flex-row gap-3" style={{ listStyle: "none" }}>
  <li onClick={() => navigate("/")}>Home</li>
  <li onClick={() => navigate("/Menu")}>Menu</li>
  <li onClick={() => navigate("/")}>ContactUs</li>
</ul>

        <ul className='Nav_ul p-0 m-0 position-relative' style={{ display: "flex", gap: "20px", listStyle: "none" }}>
          <li className='Nav_li DALJU' style={{ position: "relative" }} onClick={() => navigate("/Cart")}>
            <FaShoppingBag className='Nav_icon position-relative' />
            
          </li>
      <li onClick={()=>navigate("/Profile")} className="Nav_li d-flex align-items-center justify-content-center d-none d-lg-flex">
  <FaUser className="Nav_icon" />
</li>
          <li className='Nav_li d-flex align-items-center justify-content-center d-block d-lg-none'>
            {Show ?<ImCross className='Nav_icon' onClick={handleShow} /> : <HiOutlineBars3CenterLeft className='Nav_icon fs-2' onClick={handleShow} />}
          </li>
        </ul>
      </div>

      {/* Small Nav (Right side) */}
    {
      Show && (
          <div className=' Small_nav DALJU d-block d-lg-none' 
        style={{ height:"300px", width:"200px", position:"absolute", top:"60px", right:"0px",background:"#333" }}>
        <ul className='Nav_ul m-0 p-0 text-white flex-column ' style={{ display: "flex", gap: "20px", listStyle: "none" }}>
          <li  onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("/Menu")}>Menu</li>
          <li onClick={() => navigate("/")}>ContactUs</li>
          <li onClick={()=>navigate("/Profile")}>Profile</li>
        </ul>
      </div>
      )
    }
    </nav>
  )
}

export default Navbar
