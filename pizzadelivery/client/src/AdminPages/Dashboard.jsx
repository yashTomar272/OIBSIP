import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingInventory, setLoadingInventory] = useState(true);

  const token = localStorage.getItem("token");

  // fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_URL}/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [token]);

  // fetch inventory
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_URL}/admin/inventory`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInventory(res.data);
      } catch (err) {
        console.error("Error fetching inventory:", err);
      } finally {
        setLoadingInventory(false);
      }
    };
    fetchInventory();
  }, [token]);

  // --- Calculate KPIs ---
  let totalItems = 0;
  let totalUnits = 0;

  if (inventory) {
    const categories = ["bases", "sauces", "cheeses", "veggies", "meats"];
    totalItems = categories.reduce((sum, cat) => sum + (inventory[cat]?.length || 0), 0);
    totalUnits = categories.reduce(
      (sum, cat) => sum + (inventory[cat]?.reduce((s, item) => s + (item.qty || 0), 0) || 0),
      0
    );
  }

  return (
    <div className="grid grid-3">
      {/* KPIs */}
      <div className="cardd kpi">
        <div className="sub">Inventory Items</div>
        <div className="big text-white">
          {loadingInventory ? "..." : totalItems}
        </div>
        <div className="small">Total SKUs across categories</div>
      </div>

      <div className="cardd kpi">
        <div className="sub">Units In Stock</div>
        <div className="big text-white">
          {loadingInventory ? "..." : totalUnits}
        </div>
        <div className="small">Sum of all quantities</div>
      </div>

      <div className="cardd kpi">
        <div className="sub">Open Orders</div>
        <div className="big text-white">
          {loadingOrders ? "..." : orders.filter((o) => o.status !== "DELIVERED").length}
        </div>
        <div className="small">Excluding delivered</div>
      </div>

      {/* Recent Orders */}
      <div className="card" style={{ gridColumn: "1 / -1" }}>
        <div className="flex">
          <strong className="TW">Recent Orders</strong>
          <span className="right small">Total: {orders.length}</span>
        </div>

        <div className="table-wrapper">
          <table
            className="tablee"
            style={{ marginTop: 12, background: "#151a22" }}
          >
            <thead>
              <tr style={{ background: "#151a22" }}>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Items</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {loadingOrders ? (
                <tr>
                  <td colSpan="5" className="text-center text-white">
                    Loading...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-white">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.user?.name || "Unknown"}</td>
                    <td>
                      <span className={`status ${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{order.itemsCount || order.items?.length || 0}</td>
                    <td className="small">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        
      </div>
    </div>
  );
}
