import { NavLink } from 'react-router-dom';
import { TbLayoutSidebarRightFilled, TbLayoutSidebarFilled } from "react-icons/tb";
import React, {useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../store/auth';
import {  useNavigate } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  display: 'block',
  padding: '10px 12px',
  borderRadius: 10,
  color: isActive ? '#6ee7b7' : '#e7ecf3',
  background: isActive ? '#111a14' : 'transparent',
  border: '1px solid #1e2530',
  marginBottom: 8
});

export default function SideAdmin({ showSidebar, setShowSidebar }) {
   const dispatch=useDispatch();
    const navigate=useNavigate();
    const role=useSelector((state)=>state.auth.role);

  const handleFalse=()=>{
    setShowSidebar(false);
  }
  return (
    <aside className={`sidebar ${!showSidebar ? "d-none" : ""}`}>
      <div className='d-flex align-item-center justify-content-between'>
        <div className="Brand">Pizza Admin</div>
     
  <TbLayoutSidebarRightFilled className='icon fs-2 CR' onClick={() => setShowSidebar(false)} /> 


      </div>
      <div style={{ height: 10 }} />
      <NavLink style={linkStyle} onClick={handleFalse} to="/admin/Dashboard">Dashboard</NavLink>
      <NavLink style={linkStyle} onClick={handleFalse} to="/admin/inventory">Inventory</NavLink>
      <NavLink style={linkStyle} onClick={handleFalse} to="/admin/pizzaManagement">Pizza Management</NavLink>
      <NavLink style={linkStyle} onClick={handleFalse} to="/admin/orders">Orders</NavLink>
      <NavLink style={linkStyle} onClick={handleFalse} to="/admin/settings">Settings</NavLink>
      <button className='btn btn-primary' onClick={()=>
            {
              dispatch(authActions.logout());
              dispatch(authActions.changeRole("user"));
      localStorage.clear("token");
      localStorage.clear("user");
      navigate("/login")
            }
            } >Log Out</button>
      <hr className="sep" /> 
    </aside>
  );
}
