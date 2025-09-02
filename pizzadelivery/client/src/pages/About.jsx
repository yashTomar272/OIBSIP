import React from 'react'
import img from '../imgs/wall4.jpg' 
const About = () => {
  return (
  <>
  <div className='About_main d-flex flex-column flex-lg-row justify-content-around align-items-center gap-2' >
    {/* img section */}
    <img src={img} alt="About img" style={{height:"350px",width:"380px",borderRadius:"10px"}} />
    {/* about section */}
    <div className='d-flex flex-column gap-1 ' style={{width:"380px"}}>
        <span style={{fontSize:"22px",fontWeight:"500",color:"#FFA500"}}>About</span>
        <h1 style={{fontSize:"25px",fontWeight:"700",color:"#000"}} className='mb-3'>This Is Our Story</h1>
        <p style={{fontSize:"18px",fontWeight:"500",color:"#726969ff"}}>PizzaHub House of Pizza is a family owned and operated restaurant serving the community for over 20 years. Stop by and Dine-In our comfortable Restaurant or Call for Carry-Out orders. You may also call to pre-order your Dine-In meal. We offer only the freshest and highest quality ingredients to make your dining experience with us memorable. Ask us about having a special birthday party at the PizzaHub House of Pizza.</p>
    </div>
  </div>
  </>
  )
}

export default About