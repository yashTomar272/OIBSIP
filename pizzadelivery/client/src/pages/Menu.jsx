import Layout from './Layout'
import Menucard from '../components/Menucard'
import PizzaBuilder from '../components/PizzaBuilder'
import axios from 'axios';
import { toast } from "react-toastify";
import React, { useState, useEffect } from 'react';
import Loader from './Loader';

const Menu = () => {
  const [showBuilder, setShowBuilder] = useState(null);
    const [Showloader,setShowloader]=useState(true)
      const [pizzas, setPizzas] = useState([]);
    const token = localStorage.getItem("token");
    
  
      const fetchPizzas = async () => {
        try {
          const res = await axios.get(`${process.env.REACT_APP_URL}/pizza/get-pizza`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
          setPizzas(res.data.data);
        } catch (err) {
          console.error("Error fetching pizzas:", err);
        }finally {
          setShowloader(false);
        }
      };
  useEffect(() => {
      fetchPizzas();
    }, []);
  return (
<>
<Layout>
    <div className='Menu_main mt-5' style={{width:"100%",background:"#ebebeb",padding:"20px"}}>
<div className='DALJU'><h1 className='FONT text-center text-dark ' style={{fontWeight:"600"}}>The </h1><h1 className='FONT ' style={{color:"#FFA500",fontWeight:"600"}}>Menu</h1></div>
<div className='w-100 row d-flex flex-wrap justify-content-center align-items-center gap-4 mt-4'>
   {Showloader && <Loader/>}
    {pizzas.map((item, i) => (
     <Menucard 
       item={item} 
       key={i} 
       onOpenBuilder={() => setShowBuilder(item)} // 👈 yaha item bhej do
     />
   ))}
   {showBuilder && (
     <PizzaBuilder 
       pizza={showBuilder}  // 👈 pizza object bhej diya
       onClose={() => setShowBuilder(null)}  
     />
   )}
</div>
</div>
</Layout>
</>
)
}



export default Menu