import {  TbLayoutSidebarFilled } from "react-icons/tb";
import React, {useEffect, useState } from "react";
import axios from "axios";


export default function NavAdmin({ showSidebar, setShowSidebar }) {
  const [Profile,setProfile]=useState();
  useEffect(()=>{
    const fetchProfile=async()=>{
      try {
        const response=await axios.get(`${process.env.REACT_APP_URL}/auth/me`,{
          headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
          }
        });
        

        setProfile(response.data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  },[])

  return (
    <div className="topbar">
       <div className='d-flex align-item-center gap-4'>
         {!showSidebar && <TbLayoutSidebarFilled className='icon fs-2 CR' onClick={() => setShowSidebar(true)} />}
      <div className="Brand">🍕 Admin Dashboard</div>
       </div>
      <div className="small">Email: {Profile?.email}</div>
    </div>
  );
}

