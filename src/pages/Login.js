import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
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
      } else {
        const usernameRegex = /^[A-Za-z][A-Za-z0-9]*$/;
        if (!usernameRegex.test(value)) {
          message =
            "Must start with a letter and contain only letters/numbers (no spaces)";
        }
      }
    }
    if (name === "password") {
      const strongPasswordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!strongPasswordRegex.test(value)) {
        message =
          "Password must be 8+ chars, include upper, lower, number, and special symbol";
      }
    }
    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    validateField("username", username);
    validateField("password", password);

    if (errors.username || errors.password || !username || !password) {
      setError("Please fix the highlighted errors");
      return;
    }

    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("name", data.user.name || data.user.username);

        toast.success("Login successful!", { autoClose: 2000 });
        navigate("/books");
      } else {
        toast.error(data.message || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("An error occurred during login.");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ backgroundColor: "#f4f6fa" }}
    >
      <div className="bg-white p-5 rounded shadow" style={{ width: "350px" }}>
        <div className="text-center mb-4">
          <img
            src="/avatar.png"
            alt="Avatar"
            className="rounded-circle"
            style={{ width: "80px", height: "80px" }}
          />
          <h2 className="fw-bold mt-3">LOGIN</h2>
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
            {errors.username && (
              <small className="text-danger">{errors.username}</small>
            )}
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
            {errors.password && (
              <small className="text-danger">{errors.password}</small>
            )}
          </div>

          <button
            type="submit"
            className="btn w-100 rounded-pill fw-bold"
            style={{ backgroundColor: "#0d1b2a", color: "white" }}
          >
            Login
          </button>
        </form>
        <div className="text-center mt-3">
          <p className="mb-1">
            <Link
              to="/register"
              className="text-muted"
              style={{ textDecoration: "none" }}
            >
              Click to create new account
            </Link>
          </p>
          <p>
            <Link
              to="/"
              className="text-muted"
              style={{ textDecoration: "none" }}
            >
              Go Back To Website!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
