// src/components/PizzaBuilder.jsx
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import axios from "axios";

import { toast } from "react-toastify";


/*
  Usage:
   <PizzaBuilder onClose={() => setOpen(false)} pizza={pizzaObject} />
*/

const PizzaBuilder = ({ onClose, pizza }) => {
  const [options, setOptions] = useState({
    bases: [],
    sauces: [],
    cheeses: [],
    veggies: [],
    meats: []
  });

  const [base, setBase] = useState("");
  const [sauce, setSauce] = useState("");
  const [cheese, setCheese] = useState("");
  const [veggies, setVeggies] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [adding, setAdding] = useState(false);

  // ✅ Hooks hamesha top-level par rahenge
  useEffect(() => {
    if (!pizza) return; // agar pizza nahi hai to kuch na karo

    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        const token = localStorage.getItem("token") || "";
        const res = await axios.get(`${process.env.REACT_APP_URL}/user/options`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        setOptions({
          bases: res.data.bases || [],
          sauces: res.data.sauces || [],
          cheeses: res.data.cheeses || [],
          veggies: res.data.veggies || [],
          meats: res.data.meats || []
        });
      } catch (err) {
        console.error("Failed to fetch options:", err);
        setOptions({
          bases: ["Thin Crust", "Hand Tossed", "Pan", "Wheat", "Gluten Free"],
          sauces: ["Tomato", "Pesto", "Alfredo", "BBQ", "Spicy"],
          cheeses: ["Mozzarella", "Cheddar", "Parmesan", "Vegan Cheese"],
          veggies: ["Capsicum", "Onion", "Tomato", "Corn", "Jalapeno", "Olive", "Mushroom", "Paneer"],
          meats: []
        });
      } finally {
        setLoadingOptions(false);
      }
    };

    
    fetchOptions();
  }, [pizza]);

  const handleVeggieChange = (veggie) => {
    setVeggies((prev) =>
      prev.includes(veggie) ? prev.filter((v) => v !== veggie) : [...prev, veggie]
    );
  };

  const handleAddToCart = async () => {
    if (!pizza) return;

    const token = localStorage.getItem("token") || "";
      const userStr = localStorage.getItem("user");
  let userId = null;

  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      userId = user?.id || user?._id || null;
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
    }
  }
  console.log("userId", userId);

    if (!userId || !token) {
      alert("Please login to add to cart");
      return;
    }
    if (!base || !sauce || !cheese) {
      alert("Please select base, sauce and cheese");
      return;
    }

    try {
      setAdding(true);
      const payload = {
  userId,
  pizzaId: pizza._id || pizza.id,
  base: String(base),
  sauce: String(sauce),
  cheese: String(cheese),
  veggies: veggies.map(v => String(v)), // array of string
  meat: [], 
  quantity: 1
};

      await axios.post(`${process.env.REACT_APP_URL}/cart/add`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Added to cart");
      onClose && onClose();
    } catch (err) {
      console.error("Add to cart failed:", err);
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (!pizza) return null; // ✅ ye return sab hooks ke baad hai

  const displayPrice = pizza?.price ?? 0;

  return (
    <>
      <div
        className="PizzaBuilder_main d-flex justify-content-center align-items-center"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          background: "rgba(0,0,0,0.5)",
          zIndex: 9999,
          padding: "15px 0px"
        }}
      >
        <div
          className="PizzaBuilder_overlay bg-white d-flex flex-column flex-lg-row"
          style={{
            height: "100%",
            width: "850px",
            borderRadius: "15px",
            position: "relative",
            overflowY: "auto",
            maxHeight: "100%",
            zIndex: 10001
          }}
        >
          {/* left section */}
          <div style={{ minWidth: "330px", height: "100%" }} className=" d-flex flex-column">
            <button
              className="d-block d-lg-none"
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                border: "none",
                background: "none",
                cursor: "pointer"
              }}
              onClick={onClose}
            >
              <ImCross />
            </button>

            <div className="Img_div DALJU">
              <img src={pizza.url} alt="Pizza_img" style={{ height: "250px", width: "100%" }} />
            </div>

            <div className="d-flex flex-column justify-content-between p-2 " style={{ height: "100%" }}>
              <h3 style={{ fontSize: "22px", color: "black", fontWeight: "500" }} className="FONT ">
                {pizza.name}
              </h3>
              <p style={{ fontSize: "16px", color: "#848484" }} className="m-0 p-0">
                Customisable
              </p>

              <div className="d-flex gap-2">
                <FaStar style={{ color: "#FFA500" }} />
                <FaStar style={{ color: "#FFA500" }} />
                <FaStar style={{ color: "#FFA500" }} />
                <FaStar style={{ color: "#FFA500" }} />
                <FaStar style={{ color: "#FFA500" }} />
              </div>

              <p style={{ fontSize: "18px", fontWeight: "700" }} className="m-0 p-0 FONT">
                Final Summary
              </p>

              <ul style={{ listStyleType: "none", padding: "0px", margin: "0px" }} className="d-flex flex-column gap-1">
                <li className="PizzaBuilder_li text-dark">Base: {base || "—"}</li>
                <li className="PizzaBuilder_li text-dark">Sauce: {sauce || "—"}</li>
                <li className="PizzaBuilder_li text-dark">Cheese: {cheese || "—"}</li>
                <li className="PizzaBuilder_li text-dark">Veggies: {veggies.length ? veggies.join(", ") : "—"}</li>
              </ul>

              <button
                disabled={adding}
                className=" justify-content-between align-items-center glow-btnn d-none d-lg-flex"
                style={{ width: "100%", padding: "12px 16px", border: "none", borderRadius: "15px", color: "#fff" }}
                onClick={handleAddToCart}
              >
                <span style={{ fontSize: "18px", fontWeight: "700" }}>₹ {displayPrice}</span>
                <span style={{ fontSize: "18px", fontWeight: "500" }}>{adding ? "Adding..." : "Add to Cart"}</span>
              </button>
            </div>
          </div>

          {/* right section */}
          <div className="BORDER d-flex flex-column justify-content-between position-relative" style={{ padding: "18px" }}>
            <button
              className="d-none d-lg-block"
              style={{ position: "absolute", top: "10px", right: "10px", border: "none", background: "none", cursor: "pointer" }}
              onClick={onClose}
            >
              <ImCross />
            </button>

            {/* Base */}
            <div className="base_section mt-3">
              <div className="DALJU gap-1">
                <div style={{ height: "2px", background: "#cdcdcd", flexGrow: 1 }}></div>
                <span style={{ fontSize: "18px", fontWeight: "500", color: "black", margin: "0px 10px" }}>Choice of Base</span>
                <div style={{ height: "2px", background: "#cdcdcd", flexGrow: 1 }}></div>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-2">
                {loadingOptions ? (
                  <div>Loading options...</div>
                ) : (
                  (options.bases || []).map((b) => (
                    <button
                      key={b.name ?? b}
                      className="DALJU gap-2 p-2"
                      style={{
                        border: base === (b.name ?? b) ? "2px solid #2d9cdb" : "1px solid #dedede",
                        borderRadius: "7px",
                        background: base === (b.name ?? b) ? "#f3fbff" : "#fff"
                      }}
                      onClick={() => setBase(b.name ?? b)}
                    >
                      <div className=" DALJU" style={{ border: "1px solid green", borderRadius: "3px", height: "18px", aspectRatio: "1" }}>
                        <div style={{ background: "green", borderRadius: "50%", height: "8px", aspectRatio: "1" }}></div>
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: "500", color: "#201c1d" }}>{b.name ?? b}</div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Sauces */}
            <div className="base_section">
              <div className="DALJU gap-1">
                <div style={{ height: "2px", background: "#cdcdcd", flexGrow: 1 }}></div>
                <span style={{ fontSize: "18px", fontWeight: "500", color: "black", margin: "0px 10px" }}>Choice of sauces</span>
                <div style={{ height: "2px", background: "#cdcdcd", flexGrow: 1 }}></div>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-2">
                {(options.sauces || []).map((b) => (
                  <button
                    key={b.name ?? b}
                    className="DALJU gap-2 p-2"
                    style={{
                      border: sauce === (b.name ?? b) ? "2px solid #2d9cdb" : "1px solid #dedede",
                      borderRadius: "7px",
                      background: sauce === (b.name ?? b) ? "#f3fbff" : "#fff"
                    }}
                    onClick={() => setSauce(b.name ?? b)}
                  >
                    <div className=" DALJU" style={{ border: "1px solid green", borderRadius: "3px", height: "18px", aspectRatio: "1" }}>
                      <div style={{ background: "green", borderRadius: "50%", height: "8px", aspectRatio: "1" }}></div>
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: "500", color: "#201c1d" }}>{b.name ?? b}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cheeses */}
            <div className="base_section">
              <div className="DALJU gap-1">
                <div style={{ height: "2px", background: "#cdcdcd", flexGrow: 1 }}></div>
                <span style={{ fontSize: "18px", fontWeight: "500", color: "black", margin: "0px 10px" }}>Choice of cheeses</span>
                <div style={{ height: "2px", background: "#cdcdcd", flexGrow: 1 }}></div>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-2">
                {(options.cheeses || []).map((b) => (
                  <button
                    key={b.name ?? b}
                    className="DALJU gap-2 p-2"
                    style={{
                      border: cheese === (b.name ?? b) ? "2px solid #2d9cdb" : "1px solid #dedede",
                      borderRadius: "7px",
                      background: cheese === (b.name ?? b) ? "#f3fbff" : "#fff"
                    }}
                    onClick={() => setCheese(b.name ?? b)}
                  >
                    <div className=" DALJU" style={{ border: "1px solid green", borderRadius: "3px", height: "18px", aspectRatio: "1" }}>
                      <div style={{ background: "green", borderRadius: "50%", height: "8px", aspectRatio: "1" }}></div>
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: "500", color: "#201c1d" }}>{b.name ?? b}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Veggies */}
            <div className="base_section">
              <div className="DALJU gap-1 " style={{ width: "100%" }}>
                <div style={{ height: "2px", background: "#cdcdcd", flexGrow: 1 }}></div>
                <span style={{ fontSize: "18px", fontWeight: "500", color: "black", margin: "0px 10px" }}>Choice of veggieOptions</span>
                <div style={{ height: "2px", background: "#cdcdcd", flexGrow: 1 }}></div>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-2">
                {(options.veggies || []).map((b) => {
                  const label = b.name ?? b;
                  const active = veggies.includes(label);
                  return (
                    <button
                      key={label}
                      className="DALJU gap-2 p-2"
                      style={{
                        border: active ? "2px solid #2d9cdb" : "1px solid #dedede",
                        borderRadius: "7px",
                        background: active ? "#f3fbff" : "#fff"
                      }}
                      onClick={() => handleVeggieChange(label)}
                    >
                      <div className=" DALJU" style={{ border: "1px solid green", borderRadius: "3px", height: "18px", aspectRatio: "1" }}>
                        <div style={{ background: "green", borderRadius: "50%", height: "8px", aspectRatio: "1" }}></div>
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: "500", color: "#201c1d" }}>{label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              disabled={adding}
              className="d-flex justify-content-between align-items-center glow-btnn d-block d-lg-none"
              style={{ width: "100%", padding: "12px 16px", border: "none", borderRadius: "15px", color: "#fff", marginTop: "12px" }}
              onClick={handleAddToCart}
            >
              <span style={{ fontSize: "18px", fontWeight: "700" }}>₹ {displayPrice}</span>
              <span style={{ fontSize: "18px", fontWeight: "500" }}>{adding ? "Adding..." : "Add to Cart"}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PizzaBuilder;
