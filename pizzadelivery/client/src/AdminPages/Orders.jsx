import React, { useEffect, useState } from "react";
import axios from "axios";

const STATUS = [
  { v: "RECEIVED", label: "Order Received" },
  { v: "IN_KITCHEN", label: "In the Kitchen" },
  { v: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { v: "DELIVERED", label: "Delivered" },
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState({}); // 🔥 dropdown ka temporary value

  const token = localStorage.getItem("token");

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_URL}/admin/orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(res.data);

        // default selectedStatus me bhi set karo
        const defaults = {};
        res.data.forEach((o) => {
          defaults[o._id] = o.status;
        });
        setSelectedStatus(defaults);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  // ✅ Update status API call
  const updateStatus = async (id, newStatus) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_URL}/admin/orders/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedOrder = res.data;

      // frontend me bhi update karo
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? updatedOrder : o))
      );

      console.log("Updated:", updatedOrder);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const openOrders = orders.filter((o) => o.status !== "DELIVERED");
  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED");

  return (
    <div className="grid grid-2">
      {/* Open Orders */}
      <div className="card">
        <strong>Open Orders</strong>
        <div className="table-wrapper">
          <table className="tablee" style={{ marginTop: 12 }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Items</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center text-white">
                    Loading...
                  </td>
                </tr>
              ) : openOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-white">
                    No open orders
                  </td>
                </tr>
              ) : (
                openOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.user?.name || "Unknown"}</td>
                    <td>
                      <select
                        className="select"
                        value={selectedStatus[order._id] || order.status}
                        onChange={(e) =>
                          setSelectedStatus((prev) => ({
                            ...prev,
                            [order._id]: e.target.value,
                          }))
                        }
                      >
                        {STATUS.map((s) => (
                          <option key={s.v} value={s.v}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{order.itemsCount || order.items?.length || 0}</td>
                    <td>
                      <button
                        className="btn"
                        onClick={() =>
                          updateStatus(order._id, selectedStatus[order._id])
                        }
                      >
                        CHANGE
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delivered Orders */}
      <div className="card" style={{ gridColumn: "1 / -1" }}>
        <strong>Delivered Orders</strong>
        <div className="table-wrapper">
          <table className="tablee" style={{ marginTop: 12 }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Items</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center text-white">
                    Loading...
                  </td>
                </tr>
              ) : deliveredOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-white">
                    No delivered orders
                  </td>
                </tr>
              ) : (
                deliveredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.user?.name || "Unknown"}</td>
                    <td>
                      <span className={`status ${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, idx) => (
                          <div key={idx} className="text-sm">
                            <strong>Base:</strong> {item.base}, 
                            <strong> Sauce:</strong> {item.sauce}, 
                            <strong> Cheese:</strong> {item.cheese}
                            {item.veggies && item.veggies.length > 0 && (
                              <>
                                , <strong>Veggies:</strong>{" "}
                                {item.veggies.join(", ")}
                              </>
                            )}
                          </div>
                        ))
                      ) : (
                        "No items"
                      )}
                    </td>
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
