import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LowStockBanner() {
  const [lowItems, setLowItems] = useState([]);

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_URL}/admin/low-stock`);
        setLowItems(res.data);
      } catch (err) {
        console.error("Error fetching low stock:", err);
      }
    };

    fetchLowStock();

   
    const interval = setInterval(fetchLowStock, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!lowItems.length) return null;

  return (
   <div className="alert warn text-white" style={{ marginTop: 12 }}>
      ⚠ {lowItems.length} low-stock items — check Inventory.
    </div>
    
  );
}

