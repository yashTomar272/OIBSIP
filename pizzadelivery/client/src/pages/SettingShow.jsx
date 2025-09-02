import axios from "axios";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";

function Setting() {
  const [profile, setProfile] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setProfile(response.data.user);
        setAddress(response.data.user?.address || ""); // ✅ show current address
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  // Handle update address
  const handleUpdate = async () => {
    if (!address.trim()) {
      toast.error("Address cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `${process.env.REACT_APP_URL}/user/update-address`,
        { address }, // ✅ sirf address bhejna hai
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(response.data.message);
      setProfile((prev) => ({ ...prev, address })); // ✅ local state update
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to update address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-100 d-flex flex-column">
        <h2 className="text-center text-dark">Settings</h2>

        <div className="d-flex flex-column">
          <div className="d-flex gap-5">
            <div className="d-flex flex-column">
              <h4 className="text-dark">Username</h4>
              <span className="text-dark">{profile?.name}</span>
            </div>

            <div className="d-flex flex-column">
              <h4 className="text-dark">Email</h4>
              <span className="text-dark">{profile?.email}</span>
            </div>
          </div>

          <h5 className="mt-4 text-dark">Address</h5>
          <textarea
            className="px-3 py-2 outline"
            placeholder="Enter your address"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <button
            className="btnn ms-auto mt-2"
            style={{ height: "40px", borderRadius: "8px" }}
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </>
  );
}

export default Setting;
