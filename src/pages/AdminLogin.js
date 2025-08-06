import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; 


const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", {
        username,
        password
      });
  
      if (res.data.success) {
        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 1500,
        });
      
        localStorage.setItem("isAdmin", "true");
      
        // Delay redirect to let toast appear
        setTimeout(() => {
          navigate("/admin");
        }, 1000);
      }
       else {
        setError("Invalid admin credentials.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };
  

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="bg-white p-5 shadow rounded" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Admin Login</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Admin Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-dark w-100 fw-bold rounded-pill">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
