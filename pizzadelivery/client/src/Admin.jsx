import React, { useState } from 'react';
import SideAdmin from './AdminPages/SideAdmin';
import NavAdmin from './AdminPages/NavAdmin';
import LowStockBanner from './AdminPages/LowStockBanner';
import AppRoutes from './AppRoutes';
import './Admin.css';
import {  TbLayoutSidebarFilled } from "react-icons/tb";


export default function Admin() {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
   <>
    <div className={`layout ${!showSidebar ? "sidebar-hidden" : ""}`}>
    
  {showSidebar && <SideAdmin showSidebar={showSidebar} setShowSidebar={setShowSidebar} />}
  <div>
    <NavAdmin  showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
    <div className="content">
      <LowStockBanner />
      <AppRoutes />
    </div>
  </div>
</div>

   </>
  );
}
