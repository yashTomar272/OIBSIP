import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PImg from "../imgs/single1.webp";
import { toast } from "react-toastify";

export default function PizzaManagement() {
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [price, setPrice] = useState('');
  const [pizzas, setPizzas] = useState([]);
  const [editId, setEditId] = useState(null);


  const token = localStorage.getItem("token");

// ✅ Edit mode set करने वाला function
const handleEdit = (pizza) => {
  setName(pizza.name);
  setUrl(pizza.url);
  setPrice(pizza.price);
  setCategory(pizza.category);
  setEditId(pizza._id); // store id for update
};


// ✅ Add or Update pizza
const handleSubmit = async () => {
  try {
    if (editId) {
      // --- Update Pizza ---
      const res = await axios.put(
        `${process.env.REACT_APP_URL}/pizza/update-pizza/${editId}`,
        { name, url, price, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
    } else {
      // --- Add Pizza ---
      const res = await axios.post(
        `${process.env.REACT_APP_URL}/pizza/add-pizza`,
        { name, url, price, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
    }

    fetchPizzas(); // refresh list
    setName(""); setUrl(""); setPrice(""); setCategory(""); setEditId(null);
  } catch (err) {
    console.error("Error saving pizza:", err);
    toast.error("Failed to save pizza");
  }
};

  // ✅ Fetch pizzas from backend
  const fetchPizzas = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_URL}/pizza/get-pizza`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
      setPizzas(res.data.data);
    } catch (err) {
      console.error("Error fetching pizzas:", err);
    }
  };

  
  useEffect(() => {
    fetchPizzas();
  }, []);
const deletePizza = async (id) => {
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_URL}/pizza/delete-pizza/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
fetchPizzas(); 
     toast.success("Pizza deleted successfully!");
  } catch (err) {
    console.error("Error deleting pizza:", err);
     toast.error("Failed to delete pizza");
  }
};
  return (
    <div className="grid" style={{ gap: 20 }}>
      <div className="card">
        <div className="flex">
          <strong>Pizza Management</strong>
          <span className="right small">{pizzas.length} items</span>
        </div>

        {/* Add Pizza Form */}
        <div className="flex inventory-form" style={{ marginTop: 12 }}>
          <input
            className="input"
            placeholder="Pizza name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            className="input"
            placeholder="Pizza img url"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
          <input
            className="input"
            placeholder="Price"
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
          <select
            className="select"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option>Veg</option>
            <option>Non-Veg</option>
          </select>
          <button className="btn btn-primary" onClick={handleSubmit}>
  {editId ? "Update" : "+ Add"}
</button>
        </div>

        {/* Pizza Table */}
        <div className="table-wrapper" style={{ marginTop: 12 }}>
          <table className="tablee" >
            <thead>
              <tr>
                <th style={{ width: "40%" }}>Img</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pizzas.map((pizza) => (
                <tr key={pizza._id}>
                  <td>
                    <img src={pizza.url || PImg} alt="Pizza" style={{ height: "40px", aspectRatio: 1 }} />
                  </td>
                  <td>{pizza.name}</td>
                  <td>₹ {pizza.price}</td>
                  <td>{pizza.category}</td>
                  <td>
                    <button className="btn btn-primaryy" onClick={() => handleEdit(pizza)}>Edit</button>
                  </td>
                  <td>
                    <button className="btn btn-danger" onClick={() => deletePizza(pizza._id)}>Delete</button>
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
