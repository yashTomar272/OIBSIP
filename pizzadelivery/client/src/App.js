import './App.css';


import Login from './pages/Login'
import Verify from './pages/Verify'
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import Cart from './pages/Cart';
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.css";
 import "bootstrap/dist/js/bootstrap.bundle.js";
 import 'bootstrap/dist/css/bootstrap.min.css';
 import { ToastContainer } from "react-toastify";

import Home from './pages/Home';
import Menu from './pages/Menu';
import PizzaBuilder from './components/PizzaBuilder';
import { useNavigate, useLocation } from 'react-router-dom';
import Admin from './Admin';
import React, { useEffect } from 'react';
const App = () => {
    const navigate   = useNavigate();
const location   = useLocation();
 useEffect(() => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem("user")); 
const role = user?.role;


  // ✅ Add success and cancel to publicPaths
  const publicPaths = ['/Login', '/Signup','/Verify','/ForgotPassword','/ResetPassword'];

  if (publicPaths.includes(location.pathname)) {
    return;
  }

  if (!token) {
    return navigate('/login');
  }

  const routeMap = {
    user: '/',
    admin: '/admin',
  };

  const destination = routeMap[role] || '/';

  if (!location.pathname.startsWith(destination)) {
    navigate(destination);
  }
}, [navigate, location]);
  
  return (
   <>

   <ToastContainer position="top-right" autoClose={2000} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Verify" element={<Verify />} />
          <Route path="/PizzaBuilder" element={<PizzaBuilder />} />
          <Route path="/Menu" element={<Menu />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
       
            <Route path="/Admin/*" element={<Admin />} />
          
        </Routes>
    

   </>
  )
}

export default App