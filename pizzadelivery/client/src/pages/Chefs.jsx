import React from 'react'
import img1 from "../imgs/ch1.jpg"
import img2 from "../imgs/ch4.jpg"
import img3 from "../imgs/ch3.avif"
import img4 from "../imgs/ch2.webp"

const Chefs = () => {

  return (
    
    <>
    <div className='Chefs_main d-flex flex-wrap justify-content-around align-items-center gap-4 position-relative'>
<div className='Chefs_container position-relative'>
  <img src={img1} alt='Chef Image' className='Chefs_image' style={{height:"300px",width:"250px",borderRadius:"10px"}} />
  <div className='Chefs_info position-absolute d-flex flex-column justify-content-center align-items-center' style={{bottom:"10px",right:"60px",borderRadius:"10px",backgroundColor:"rgba(240, 233, 233, 0.93)",padding:"10px"}}>
    <span style={{fontSize:"18px",fontWeight:"500",color:"#FFA500"}}>Jenny Wilson</span>
    <p style={{fontSize:"15px",fontWeight:"500",color:"#726969ff"}}>Senior Chef</p>
  </div>
</div>
<div className='Chefs_container position-relative'>
  <img src={img2} alt='Chef Image' className='Chefs_image' style={{height:"300px",width:"250px",borderRadius:"10px"}} />
  <div className='Chefs_info position-absolute d-flex flex-column justify-content-center align-items-center' style={{bottom:"10px",right:"60px",borderRadius:"10px",backgroundColor:"rgba(240, 233, 233, 0.93)",padding:"10px"}}>
    <span style={{fontSize:"18px",fontWeight:"500",color:"#FFA500"}}>Song Rajput</span>
    <p style={{fontSize:"15px",fontWeight:"500",color:"#726969ff"}}>Senior Chef</p>
  </div>
</div>
<div className='Chefs_container position-relative'>
  <img src={img3} alt='Chef Image' className='Chefs_image' style={{height:"300px",width:"250px",borderRadius:"10px"}} />
  <div className='Chefs_info position-absolute d-flex flex-column justify-content-center align-items-center' style={{bottom:"10px",right:"60px",borderRadius:"10px",backgroundColor:"rgba(240, 233, 233, 0.93)",padding:"10px"}}>
    <span style={{fontSize:"18px",fontWeight:"500",color:"#FFA500"}}>Annete Black</span>
    <p style={{fontSize:"15px",fontWeight:"500",color:"#726969ff"}}>Senior Chef</p>
  </div>
</div>
<div className='Chefs_container position-relative'>
  <img src={img4} alt='Chef Image' className='Chefs_image' style={{height:"300px",width:"250px",borderRadius:"10px"}} />
  <div className='Chefs_info position-absolute d-flex flex-column justify-content-center align-items-center' style={{bottom:"10px",right:"60px",borderRadius:"10px",backgroundColor:"rgba(240, 233, 233, 0.93)",padding:"10px"}}>
    <span style={{fontSize:"18px",fontWeight:"500",color:"#FFA500"}}>Rohan Tipi</span>
    <p style={{fontSize:"15px",fontWeight:"500",color:"#726969ff"}}>Senior Chef</p>
  </div>
</div>
    </div>
    </>
  )
}

export default Chefs