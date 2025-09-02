import React from 'react'
import img from "../imgs/single1.webp"
import { FaCircleArrowRight } from "react-icons/fa6";
const Menucard = ({ onOpenBuilder,item }) => {
  return (
    <>
    <div  onClick={onOpenBuilder}  style={{height:"300px",width:"230px",borderRadius:"45% 45% 0px 0px",padding:"0px",boxShadow:"0 0 10px rgba(0,0,0,0.3)"}} className='cr CR'>
<img src={item.url} alt='Menu_img' style={{width:"230px",height:"230px",borderRadius:"45% 45% 0px 0px"}} />
<div className='d-flex justify-content-between align-items-center p-1 w-100' style={{height:"70px"}}>
    <h4 style={{width:"150px",fontSize:"21px",color:"#faa810ff"}} className=' FONT'>{item.name}</h4>
    <FaCircleArrowRight className='fs-2 CR' />
</div>
    </div>
    </>
  )
}

export default Menucard
