import React from 'react'
import img from "../imgs/single1.webp"

const PizzaCard = ({ onOpenBuilder,item }) => {
  return (
    <>
      <div className='PizzaCard_main position-relative p-0 '  
           style={{width:"300px",backgroundColor:"#FFF",borderRadius:"10px",boxShadow:"0 0 10px rgba(0,0,0,0.1)"}}>
        <img src={item.url} alt="Pizza" className='img-fluid' style={{width:"100%",height:"200px",borderTopRightRadius:"10px",borderTopLeftRadius:"10px"}}/>
        <div className='Pizza_point DALJU' style={{border:"1px solid green",borderRadius:"3px",height:"20px",aspectRatio:"1"}}>
            <div style={{background:"green",borderRadius:"50%",height:"10px",aspectRatio:"1"}}></div>
        </div>
        <h4 style={{fontSize:"22px",color:"#000000",fontWeight:"600"}} className='FONT text-center'>{item.name}</h4>
        <div className='DALJU d-flex flex-row justify-content-between align-items-center my-2 mx-2' >
          <span style={{fontSize:"18px",fontWeight:"500",color:"#726969ff"}}>₹ {item.price}</span>
          <button 
            onClick={onOpenBuilder} 
            className='glow-btnn' 
            style={{padding:"10px 20px",borderRadius:"7px",border:"none",cursor:"pointer",color:"#00000",fontSize:"16px",fontWeight:"500"}}>
            View
          </button>
        </div>
      </div>
    </>
  )
}

export default PizzaCard

