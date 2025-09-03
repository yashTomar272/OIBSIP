// src/components/CartPage.jsx
import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { FaIndianRupeeSign } from "react-icons/fa6";
import axios from "axios";
import Layout from "./Layout";
import Loader from "./Loader"
import { toast } from "react-toastify";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  console.log("cart", cart);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  const getAuth = () => {
  // Token direct string hai
  const token = localStorage.getItem("token") || "";

  // User JSON string hai, isliye parse karna hoga
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

  return { token, userId };
};





  const fetchCart = async () => {
    const { token, userId } = getAuth();
    if (!userId) {
      setCart({ user: null, items: [] });
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_URL}/cart/${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setCart(res.data || { user: userId, items: [] });
    } catch (err) {
      console.error("Fetch cart failed:", err);
      setCart({ user: userId, items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, []);

  const removeItem = async (itemId) => {
    const { token, userId } = getAuth();
    if (!userId) return alert("Please login");
    try {
      await axios.delete(`${process.env.REACT_APP_URL}/cart/${userId}/${itemId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      fetchCart();
    } catch (err) {
      console.error("Remove failed:", err);
      toast.error("Failed to remove item");
    }
  };

  const changeQuantity = async (item, newQty) => {
    const { token, userId } = getAuth();
    if (!userId) return alert("Please login");
    if (newQty < 1) return removeItem(item._id);

    try {
      // simple approach: remove + re-add with new qty
      await axios.delete(`${process.env.REACT_APP_URL}/cart/${userId}/${item._id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      await axios.post(
        `${process.env.REACT_APP_URL}/cart/add`,
        {
          userId,
          pizzaId: item.pizza._id || item.pizza.id,
          base: item.base,
          sauce: item.sauce,
          cheese: item.cheese,
          veggies: item.veggies,
          meat: item.meat || [],
          quantity: newQty,
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );


      fetchCart();
    } catch (err) {
      console.error("Change qty failed:", err);
      toast.error("Failed to change quantity");
    }
  };

  const getTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce(
      (sum, it) => sum + (it.pizza?.price || 0) * (it.quantity || 1),
      0
    );
  };

  
// inside CartPage component

const handleBuyNow = async () => {
  const { token, userId } = getAuth();
  if (!userId) return alert("Please login");

  try {
    setProcessingPayment(true);

    // 1) amount in paise (₹ -> *100)
    const amount = getTotal() * 100;

    // 2) Create razorpay order from backend
    const { data } = await axios.post(
      `${process.env.REACT_APP_URL}/pay/razorpay/order`,
      { amount },
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );

    if (!data?.success) {
      setProcessingPayment(false);
      return alert("Failed to initialize payment");
    }

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_R8qd9nDsSFaeqC", // optional env on frontend
      amount,
      currency: "INR",
      name: "pizzaHub",
      description: "Pizza Order",
      order_id: data.order.id,
      handler: async function (response) {
        // 3) On success, verify on backend (and place order + reduce inventory + clear cart)
        try {
          const verifyRes = await axios.post(
            `${process.env.REACT_APP_URL}/pay/razorpay/verify`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId
            },
            { headers: token ? { Authorization: `Bearer ${token}` } : {} }
          );

          if (verifyRes.data?.success) {
             toast.success("Payment successful! Order placed.");
            fetchCart(); // cart will be cleared from server; refresh UI
          } else {
             toast.error("Verification failed");
          }
        } catch (err) {
          console.error("Verification error:", err);
          alert("Payment completed but verification failed");
        } finally {
          setProcessingPayment(false);
        }
      },
      modal: {
        ondismiss: function () {
          setProcessingPayment(false);
        },
      },
     prefill: {
  name: "",
  email: "",
  contact: "1234567890"   
},
      theme: { color: "#54c1f3ff" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error("Buy now error:", err);
    setProcessingPayment(false);
     toast.error("Unable to start payment");
  }
};

  if (loading) {
    return (
      <Layout>
        <Loader/>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="Cart_main p-2 container d-flex pb-5 flex-column mt-5 pt-4 bg-white">
        <h1 className="text-center text-dark">
          My<span className="color">Cart</span>
        </h1>

        <div className="Cart_main_second d-flex flex-wrap justify-content-center justify-content-lg-between gap-4 mt-3">
          <div className="Cart_First d-flex flex-column gap-4">
            {cart?.items?.length ? (
              cart.items.map((it) => (
                <div key={it._id} className="Product_card p-2" style={{ width: "350px" }}>
                  <div className="d-flex gap-2">
                    <img
                      src={it.pizza?.url || "/placeholder.png"}
                      alt="Product_img"
                      className="img-fluid"
                      style={{ width: "80px", height: "80px" }}
                    />
                    <div>
                      <h4 className="pb-0 mb-0 text-dark">{it.pizza?.name || "Pizza"}</h4>
                      <span className="d-flex gap-4 mb-0 pb-0" style={{ color: "#d4d3d3" }}>
                        <p className="mb-1">{it.base || ""}</p>
                      </span>
                      <div className="d-flex gap-2">
                        <span>
                          <p className="mb-0 fw-bold fs-6 text-dark">
                            <FaIndianRupeeSign /> {it.pizza?.price ?? 0}
                          </p>
                        </span>
                        <span>
                          <p style={{ color: "#34ea34", marginBottom: "0px" }}>5% off</p>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex mt-3 gap-5">
                    <div className="d-flex gap-2 fw-bold text-dark align-items-center">
                      <button
                        className="text-dark"
                        style={{ width: "30px", border: "none", fontWeight: "700", fontSize: "15px" }}
                        onClick={() => changeQuantity(it, (it.quantity || 1) - 1)}
                      >
                        -
                      </button>
                      <span>{it.quantity || 1}</span>
                      <button
                        style={{ width: "30px", border: "none", fontWeight: "700", fontSize: "15px" }}
                        onClick={() => changeQuantity(it, (it.quantity || 1) + 1)}
                      >
                        +
                      </button>
                    </div>

                    <span style={{ color: "red", cursor: "pointer" }} onClick={() => removeItem(it._id)}>
                      <MdDeleteOutline /> Remove
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: "20px" ,color:"black"}}>Your cart is empty</div>
            )}
          </div>

          <div className="Cart_second d-flex flex-column gap-3 p-2" style={{ width: "382px" }}>
            <span style={{ borderBottom: "1px solid #737373" }}>
              <h5 className=" text-dark">Price Details</h5>
            </span>

            <div className="d-flex flex-row justify-content-between mb-0">
              <p className="mb-0  text-dark">Price ({cart?.items?.length || 0} item)</p>
              <p className="mb-0  text-dark">
                <FaIndianRupeeSign /> {getTotal()}
              </p>
            </div>

            <div className="d-flex flex-row justify-content-between mb-0">
              <p className="mb-0 text-dark">Delivery Charges</p>
              <p className="mb-0  text-dark" style={{ color: "#34ea34" }}>
                Free
              </p>
            </div>

            <div className="d-flex flex-row justify-content-between mb-0">
              <h5 className="mb-0  text-dark">Total Amount</h5>
              <h5 className="mb-0  text-dark">
                <FaIndianRupeeSign /> {getTotal()}
              </h5>
            </div>

            <button
              className="btnn w-100 rounded"
              style={{ height: "47px" }}
             disabled={processingPayment || (cart?.items?.length || 0) === 0}
  onClick={handleBuyNow}
            >
             {processingPayment ? "Processing..." : "Buy now"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
