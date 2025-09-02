import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const KINDS = ["base", "sauce", "cheese", "veggie", "meat"];

export default function InventoryManagement() {
  const [kind, setKind] = useState("base");
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [thr, setThr] = useState("");
  const [inventory, setInventory] = useState({
    bases: [],
    sauces: [],
    cheeses: [],
    veggies: [],
    meats: [],
  });
  


  const [editIndex, setEditIndex] = useState(null); // ✅ Edit Mode
  const token = localStorage.getItem("token");

  // ✅ Fetch Inventory
  const fetchInventory = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_URL}/admin/inventory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventory(res.data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      toast.error("Failed to fetch inventory");
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // ✅ Add or Update Item
  const handleSubmit = async () => {
    if (!name || !qty) return toast.error("Enter all fields!");

    const updated = { ...inventory };

    if (editIndex !== null) {
      // --- Update existing item
      updated[`${kind}s`][editIndex] = {
        ...updated[`${kind}s`][editIndex],
        name,
        qty: Number(qty),
        threshold: Number(thr) || 20,
      };
    } else {
      // --- Add new item
      const newItem = { name, qty: Number(qty), threshold: Number(thr) || 20 };
      updated[`${kind}s`] = [...(updated[`${kind}s`] || []), newItem];
    }

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_URL}/admin/inventory`,
        updated,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInventory(res.data.inv);
      toast.success(editIndex !== null ? "Item updated!" : "Item added!");
      setName("");
      setQty("");
      setThr("");
      setEditIndex(null);
    } catch (err) {
      console.error("Error saving item:", err);
      toast.error("Failed to save item");
    }
  };

  // ✅ Edit Item
  const handleEdit = (item, index) => {
    setName(item.name);
    setQty(item.qty);
    setThr(item.threshold);
    setEditIndex(index);
  };

  // ✅ Delete Item
  const handleDelete = async (index) => {
    const updated = { ...inventory };
    updated[`${kind}s`] = (updated[`${kind}s`] || []).filter((_, i) => i !== index);

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_URL}/admin/inventory`,
        updated,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInventory(res.data.inv);
      toast.success("Item deleted!");
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.error("Failed to delete item");
    }
  };

  return (
    <div className="grid" style={{ gap: 20 }}>
      <div className="card">
        <div className="flex">
          <strong>Inventory Management</strong>
        </div>

        {/* Add / Edit Form */}
        <div className="flex inventory-form" style={{ marginTop: 12 }}>
          <select
            className="select"
            value={kind}
            onChange={(e) => {
              setKind(e.target.value);
              setEditIndex(null);
              setName("");
              setQty("");
              setThr("");
            }}
          >
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
          <input
            className="input"
            placeholder="Item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input"
            placeholder="Qty"
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />
          <input
            className="input"
            placeholder="Threshold"
            type="number"
            value={thr}
            onChange={(e) => setThr(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSubmit}>
            {editIndex !== null ? "Update" : "+ Add"}
          </button>
        </div>

        {/* Only Selected Category Table */}
        <div style={{ marginTop: 20 }} className="table-wrapper">
          <h4>{kind.toUpperCase()}</h4>
          <table className="tablee">
            <thead>
              <tr>
                <th style={{ width: "40%" }}>Name</th>
                <th>Qty</th>
                <th>Threshold</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(inventory[`${kind}s`] || []).map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.qty}</td>
                  <td>{item.threshold}</td>
                  <td>
                    <button
                      className="btn btn-primaryy"
                      onClick={() => handleEdit(item, i)}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(i)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
