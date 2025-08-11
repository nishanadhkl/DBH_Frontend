import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name, value) => {
    let message = "";
    if (name === "username") {
      if (!value.trim()) {
        message = "Username is required";
      }
    }
    if (name === "password") {
      if (!value || value.length < 4) {
        message = "Password must be at least 4 characters";
      }
    }
    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Synchronous validation to avoid stale state
    const usernameError = !username.trim() ? "Username is required" : "";
    const passwordError = !password || password.length < 4 ? "Password must be at least 4 characters" : "";
    setErrors({ username: usernameError, password: passwordError });
    if (usernameError || passwordError) {
      setError("Please fix the highlighted errors");
      return;
    }

    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", {
        username,
        password,
      });

      if (res.data.success) {
        toast.success("Login successful!", { position: "top-center", autoClose: 1500 });
        localStorage.setItem("isAdmin", "true");

        setTimeout(() => {
          navigate("/admin");
        }, 1000);
      } else {
        setError("Invalid admin credentials.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f4f6fa",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="d-flex align-items-center justify-content-center flex-grow-1"
        style={{ paddingTop: "20px", paddingBottom: "20px" }}
      >
        <div className="bg-white p-5 rounded shadow" style={{ width: "350px" }}>
          <div className="text-center mb-4">
            <img
              src="/avatar.png"
              alt="Avatar"
              className="rounded-circle"
              style={{ width: "80px", height: "80px" }}
            />
            <h2 className="fw-bold mt-3">ADMIN LOGIN</h2>
          </div>

          {error && <p className="text-danger text-center">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    validateField("username", e.target.value);
                  }}
                />
                <label htmlFor="username">Username</label>
              </div>
              {errors.username && <small className="text-danger">{errors.username}</small>}
            </div>

            <div className="mb-3 position-relative">
              <div className="form-floating">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validateField("password", e.target.value);
                  }}
                />
                <label htmlFor="password">Password</label>

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    fontSize: "18px",
                    color: "#666",
                  }}
                >
                  {showPassword ? "🙈" : "👁"}
                </span>
              </div>
              {errors.password && <small className="text-danger">{errors.password}</small>}
            </div>

            <button
              type="submit"
              className="btn w-100 rounded-pill fw-bold"
              style={{ backgroundColor: "#0d1b2a", color: "white" }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
