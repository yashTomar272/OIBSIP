import Layout from './Layout';
import photo from '../imgs/user.jpg'
import { MdCurrencyRupee } from "react-icons/md";
import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../store/auth';
import {  useNavigate } from "react-router-dom";
import Order from './OrderShow';
import Setting from './SettingShow';
import { TbLogout } from "react-icons/tb";

import React, {useEffect, useState } from "react";



export default function Profile(){
 const dispatch=useDispatch();
  const navigate=useNavigate();
  const role=useSelector((state)=>state.auth.role);
  const [Profile,setProfile]=useState();
    const [date,setDate]=useState([]);
console.log(date)
  console.log("user=>",Profile);
  useEffect(()=>{
    const fetchProfile=async()=>{
      try {
        const response=await axios.get(`${process.env.REACT_APP_URL}/auth/me`,{
          headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
          }
        });
         const hhdate=new Date( response.data.user.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  });

setDate(hhdate)
        setProfile(response.data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  },[])

  return(
    <>
    <Layout>
      <div className=" Main_user w-100  DALJU h-100 bg-light">

     <div className="container  py-5 DALJU flex-column gap-4">
    <div className='User_First mt-4 bg- w-100  d-flex align-items-center justify-content-center p-3 flex-column BACK ' style={{borderRadius:"10px"}}>
        <div className='DALJU' style={{width:"90px",aspectRatio:"1",borderRadius:"50%",border:"1px solid #737373"}}> <img src={photo} alt='User_img'  style={{width:"90px",aspectRatio:"1",borderRadius:"50%"}}/></div>

     <div className='d-flex flex-column  justify-content-center gap-1'>
     <div className='d-flex gap-2'> <h6 style={{color:"black"}}>Name :</h6><span style={{color:"black"}}>{Profile?.name}</span></div>
     <div className='d-flex gap-2' style={{color:"black"}}> <h6 style={{color:"black"}}>Email :</h6>{Profile?.email}</div>
       <div className='d-flex gap-2' style={{color:"black"}}> <h6 style={{color:"black"}}>Date :</h6>{date}</div>
     </div>
      <div className='DALJU'><button className='btnn DALJU gap-2' 
      
      style={{height:"40px",borderRadius:"8px"}}   onClick={()=>
      {
        dispatch(authActions.logout());
        dispatch(authActions.changeRole("user"));
localStorage.clear("token");
localStorage.clear("user");
navigate("/login")
      }
      }> Logout <TbLogout/> </button> </div>
    
  </div>
  
<Tabs className=" flex-column">
<TabList className="d-flex gap-2 listStyle  " style={{listStyle:"none"}}>
 
  <Tab>
   <button className='btnn' style={{height:"40px",borderRadius:"8px"}}> Order</button>
    </Tab>
    <Tab>
   <button className='btnn' style={{height:"40px",borderRadius:"8px"}}> Setting</button>
    </Tab>
</TabList>
            
            <TabPanel>
             <Order/>
            </TabPanel>
            <TabPanel>
              <Setting/>
            </TabPanel>
</Tabs>
  


     
     
     
     
        
    
    </div>
    </div>
   
    </Layout>
    </>
  )
}