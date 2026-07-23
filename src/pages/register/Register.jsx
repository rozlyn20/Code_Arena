import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./register.css";
// import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setError("");

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    // Basic Validation
    if (!username || !email || !password || !confirmPassword) {
      return setError("Please fill in all the fields.");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      setLoading(true);
      setError("");

      console.log(formData);

      // Later
      // const res = await axios.post("/api/auth/register", {
      //   username,
      //   email,
      //   password,
      // });

      // navigate("/login");

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">

      <div className="left">
        <form onSubmit={handleSubmit}>
          <div className="wrapper">
            <h1>Create Account</h1>

            <p className="body">
              Join CodeArena and start practicing coding interviews with
              developers around the world.
            </p>

            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />

            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            {error && (
              <div
                style={{
                  backgroundColor: "#ffe0e0",
                  color: "#d8000c",
                  padding: "12px 16px",
                  border: "1px solid #d8000c",
                  borderRadius: "8px",
                  marginTop: "12px",
                  fontWeight: "500",
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}

            <p style={{ textAlign: "center", marginTop: "20px" }}>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#3b82f6",
                  textDecoration: "none",
                  fontWeight: "600",
                }}
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;