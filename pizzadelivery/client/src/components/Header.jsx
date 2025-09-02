import React from 'react'
import { IoPizza } from "react-icons/io5";
import { PiUsersThreeFill } from "react-icons/pi";
import img from "../imgs/pizza9.jpg"
const Header = () => {
  return (
    <>
    <div className='Header_main position-relative'>
<img src={img} alt="Back_header" className='Back_header img-fluid'  style={{height:"100vh",width:"100%"}}/>
<div className='Header_content  text-white'>

  <div className='d-flex flex-row'><span style={{fontSize:"31px",fontWeight:"600"}}>It's Not Just A Pizza, It's An <span className='color' style={{fontSize:"31px",fontWeight:"600"}}>Experience!</span></span></div>
  <p className='p-0 m-0 FONT' style={{fontSize:"17px",fontWeight:"500"}}>
    Come and get some work done atour family friendly cowork space and private offices with full kitchen while your kids play at our playground.
  </p>
  <button className=' DALJU glow-btn mt-2' > Order now</button>
  <div className='d-flex flex-row align-items-center mt-3 gap-3'>
<div className='d-flex gap-2 align-items-center' >
<div style={{height:"45px",aspectRatio:"1",borderRadius:"7px",border:"2px solid #FFF"}} className='DALJU text-white'>
<PiUsersThreeFill className='fs-3'/>
</div>
<div className='d-flex flex-column text-white'>
<span  style={{fontSize:"15px",fontWeight:"500",color:"#FFA500"}}>1000+</span>
<span  style={{fontSize:"15px",fontWeight:"500"}}>Customers</span>
</div>
</div>
<div className='d-flex gap-2 align-items-center' >
<div style={{height:"45px",aspectRatio:"1",borderRadius:"7px",border:"2px solid #FFF"}} className='DALJU text-white'>
<IoPizza className='fs-3'/>
</div>
<div className='d-flex flex-column text-white'>
<span  style={{fontSize:"15px",fontWeight:"500",color:"#FFA500"}}>1500+</span>
<span  style={{fontSize:"15px",fontWeight:"500"}}>Delivery</span>
</div>
</div>
  </div>
</div>

    </div>
    </>
  )
}

export default Header