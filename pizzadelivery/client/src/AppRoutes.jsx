import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './AdminPages/Dashboard';
import Orders from './AdminPages/Orders';
import Inventory from './AdminPages/Inventory';
import Settings from './AdminPages/Settings';
import PizzaManagement from './AdminPages/PizzaManagement';
import './Admin.css'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/Dashboard" replace />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/Orders" element={<Orders />} />
      <Route path="/Inventory" element={<Inventory />} />
      <Route path="/PizzaManagement" element={<PizzaManagement />} />
      <Route path="/Settings" element={<Settings />} />

      
    </Routes>
  );
}
