import PizzaCard from '../components/PizzaCard'
import PizzaBuilder from '../components/PizzaBuilder'
import axios from 'axios';
import { toast } from "react-toastify";
import React, { useState, useEffect } from 'react';
import Loader from './Loader';


const PizzaShow = () => {
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
    <div className='PizzaShow_main position-relative bg-white' style={{width:"100%",padding:"10px"}}>
<h1 className='FONT text-center text-dark ' style={{fontWeight:"600"}}>Trending Pizza</h1>
<div className='w-100 row d-flex flex-wrap justify-content-center align-items-center gap-4 mt-4'>
 {Showloader && <Loader/>}
 {pizzas.map((item, i) => (
  <PizzaCard 
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
    </>
  )
}

export default PizzaShow