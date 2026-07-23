import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../register/register.css";
// import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    const { email, password } = formData;

    if (!email || !password) {
      return setError("Please fill in all the fields.");
    }

    try {
      setLoading(true);
      setError("");

      console.log(formData);

      // Later
      // const res = await axios.post("/api/auth/login", {
      //   email,
      //   password,
      // });

      // Save JWT
      // localStorage.setItem("token", res.data.token);

      // Navigate to dashboard
      // navigate("/home");

    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">


      <div className="left">
        <form onSubmit={handleSubmit}>
          <div className="wrapper">
            <h1>Welcome Back</h1>

            <p className="body">
              Sign in to continue practicing coding interviews and collaborating
              with your friends.
            </p>

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
              autoComplete="current-password"
              required
            />

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Login"}
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
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: "#3b82f6",
                  textDecoration: "none",
                  fontWeight: "600",
                }}
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;