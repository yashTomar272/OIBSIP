import React from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import img from "../imgs/v2.png";
import { useNavigate } from "react-router-dom";

const Verify = () => {
    const navigate=useNavigate()
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");

  const handleVerify = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/auth/verify-email?token=${token}`);
      alert(res.data.message);  // ✅ "Email verified"
      navigate("/login")
    } catch (err) {
      alert(err.response.data.message); // ❌ "Invalid/Expired token"
    }
  };

  return (
    <div className="DALJU flex-column bg-white p-2 gap-4" style={{ height: "100vh" }}>
      <img src={img} alt="Verification" className="img-fluid" style={{ height: "500px", aspectRatio: 1 }} />
      <button onClick={handleVerify} className="btnn" style={{ height: "40px", borderRadius: "8px" }}>
        Verify
      </button>
    </div>
  );
};

export default Verify;
