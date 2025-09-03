import axios from 'axios'
import { MdCurrencyRupee } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import img from "../imgs/single1.webp"
import { useEffect, useState } from 'react';
import Loader from "./Loader"



function Order() {
  const [orders, setOrders] = useState([]);
    const [Showloader,setShowloader]=useState(true)
const token = localStorage.getItem("token") || "";

useEffect(() => {
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_URL}/user/orders`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setOrders(res.data);   // ✅ data save karo
      console.log("Order:", res.data); // ✅ yahan dekho kya aa raha hai
    } catch (err) {
      console.error("Error fetching orders:", err);
    }finally {
        setShowloader(false);
      }
  };
  fetchOrders();
}, []);


  
  return (
  <>
  <div className='w-100 h-100 dalju flex-column'>
  <h2 className='text-center text-dark'>My Order</h2>
            <div >
               {Showloader && <Loader/>}
              

            {orders.map((order, i) => (
  <div key={i} className='User_Second d-flex flex-column mb-2'
       style={{borderRadius:"9px",border:"2px solid #e6e5e5",maxWidth:"600px"}}>
    
    {/* Order Header */}
    <div className="d-flex flex-md-row flex-column justify-content-around gap-2 p-3 BACK"
         style={{borderTopLeftRadius:"8px",borderTopRightRadius:"8px"}}>
      <div className='d-flex gap-3 text-center justify-content-between'>
        <div>
          <h6 className='mb-0' style={{color:"black"}}>Order Id</h6>
          <span style={{color:"#726969ff"}}>{order._id}</span>
        </div>
        <div>
          <h6 className='mb-0' style={{color:"black"}}>Date</h6>
          <span style={{color:"#726969ff"}}>{new Date(order.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <div className='d-flex gap-3 text-center justify-content-between'>
        <div>
          <h6 className='mb-0' style={{color:"black"}}>Total Amount</h6>
          <span style={{color:"#726969ff"}}>
            <MdCurrencyRupee style={{color:"#726969ff"}}/>{order.totalAmount}
          </span>
        </div>
        <div>
          <h6 className='mb-0' style={{color:"black"}}>Order Status</h6>

           {order.status=== "RECEIVED" &&(
        <span style={{color:"red"}}>{order.status}</span>
      )}
      {order.status=== "IN_KITCHEN" &&(
        <span style={{color:"blue"}}>{order.status}</span>
      )}
      {order.status=== "OUT_FOR_DELIVERY" &&(
        <span style={{color:"#ff8800"}}>{order.status}</span>
      )}
      {order.status=== "DELIVERED" &&(
        <span style={{color:"green"}}>{order.status}</span>
      )}
        </div>
      </div>
    </div>

    {/* Order Items */}
    <div className='p-3 gap-5 d-flex flex-column w-100'>
      {order.items.map((it, j) => (
        <div key={j} className='d-flex gap-2 justify-content-between align-items-center'>
          <div className="p-2 dalju"
               style={{width:"100px",height:"100px",boxShadow:"0px 2px 4px rgba(0,0,0,0.25)",borderRadius:"7px"}}>
            <img src={it.pizza?.url} alt={it.pizza?.name}
                 style={{width:"80px",height:"90px",borderRadius:"7px"}} />
          </div>
          <div className='d-flex flex-column' style={{color:"black"}}>
            <span>{it.pizza?.name}</span>
            <span style={{color:"#c9c5c5"}}>{it.base}, {it.sauce}, {it.cheese}</span>
            <span style={{color:"#c9c5c5"}}>x{it.quantity}</span>
          </div>
          <h6 style={{color:"black"}}>
            <MdCurrencyRupee/> {it.pizza?.price * it.quantity}
          </h6>
        </div>
      ))}
    </div>
  </div>
))}

           
       
    
    </div>
  
            
        
     

        </div>  
  </>
  )
}

export default Order