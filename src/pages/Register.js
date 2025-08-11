import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NavigationBar from "../components/Navbar";
import Footer from "../components/Footer";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    contact: "",
    email: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");

  // Show/hide password states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateField = (name, value) => {
    let message = "";

    switch (name) {
      case "fullName":
      case "address":
        if (!value.trim()) message = `${name} is required`;
        break;

      case "username":
        if (!value.trim()) {
          message = "Username is required";
        } else {
          const usernameRegex = /^[A-Za-z][A-Za-z0-9]*$/;
          if (!usernameRegex.test(value)) {
            message =
              "Must start with a letter and contain only letters/numbers (no spaces)";
          }
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) message = "Email is required";
        else if (!emailRegex.test(value)) message = "Invalid email format";
        break;

      case "contact":
        const nepalNumberRegex = /^(97|98)\d{8}$/;
        if (!nepalNumberRegex.test(value)) {
          message = "Contact must be 10 digits and start with 97 or 98";
        }
        break;

      case "password":
        const strongPasswordRegex =
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!strongPasswordRegex.test(value)) {
          message =
            "Password must be 8+ chars, include upper, lower, number, and special symbol";
        }
        break;

      case "confirmPassword":
        if (value !== formData.password) {
          message = "Passwords do not match";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateForm = () => {
    let isValid = true;
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
      if (formData[key] === "" || errors[key]) {
        isValid = false;
      }
    });
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Please fix the highlighted errors");
      return;
    }

    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid JSON response");
      }

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userId", data.user._id || data.user.id);
        localStorage.setItem("name", data.user.fullName || data.user.username);

        toast.success("Registration successful! Redirecting to home...");
        navigate("/");
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      toast.error("Registration failed.");
    }
  };

  const fields = {
    fullName: "Full Name",
    username: "Username",
    password: "Password",
    confirmPassword: "Confirm Password",
    contact: "Contact",
    email: "Email",
    address: "Address",
  };

  return (
    <div style={{ backgroundColor: "#f4f6fa", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavigationBar />
      <div className="d-flex justify-content-center flex-grow-1" style={{ paddingTop: "40px", paddingBottom: "40px" }}>
        <div className="bg-white p-5 rounded shadow" style={{ width: "400px" }}>
          <div className="text-center" style={{ marginBottom: "20px" }}>
            <img
              src="/avatar.png"
              alt="Avatar"
              className="rounded-circle"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                objectPosition: "center",
                marginBottom: "8px",
              }}
            />
            <h2 className="fw-bold">SIGN-UP</h2>
          </div>

          {error && <p className="text-danger text-center">{error}</p>}

          <form onSubmit={handleSubmit}>
            {Object.entries(fields).map(([key, label]) => (
              <div className="mb-3" key={key}>
                <div className="form-floating position-relative">
                  <input
                    type={
                      key.toLowerCase().includes("password")
                        ? key === "password"
                          ? showPassword
                            ? "text"
                            : "password"
                          : showConfirmPassword
                          ? "text"
                          : "password"
                        : key === "email"
                        ? "email"
                        : "text"
                    }
                    className="form-control"
                    id={key}
                    name={key}
                    placeholder={label}
                    value={formData[key]}
                    onChange={handleChange}
                  />
                  <label htmlFor={key}>{label}</label>

                  {/* Eye icon for password fields */}
                  {key === "password" && (
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
                  )}
                  {key === "confirmPassword" && (
                    <span
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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
                      {showConfirmPassword ? "🙈" : "👁"}
                    </span>
                  )}
                </div>
                {errors[key] && (
                  <small className="text-danger">{errors[key]}</small>
                )}
              </div>
            ))}

            <button
              type="submit"
              className="btn w-100 rounded-pill fw-bold"
              style={{ backgroundColor: "#0d1b2a", color: "white" }}
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
