import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://localhost:7126/api/Auth/login",
        {
          username,
          password,
        }
      );

      const { redirectUrl, userId } = response.data;
      localStorage.setItem("userId", userId);
      
      if (userId) {
        toast.success("Login Successful");
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1000); 
      }

    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again or Register First"); // Use toast for error message
    }
  };

  return (
    <div
      className=" d-flex justify-content-center align-items-center"
      style={{
        backgroundColor:"#0F1A27",
        height: "100vh", 
        position: "relative",
      }}
    >
      <form 
        onSubmit={handleLogin} 
        className="bg-white p-5 rounded shadow"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)", // Center the form
          width: "100%",
          maxWidth: "400px", // Optional: Limit the width of the form
        }}
      >
        <h2 className="text-center mb-4">Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="d-flex justify-content-center mt-3">
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
        <div className="text-center d-flex justify-content-center align-items-center">
          <p className="mb-0 mr-2">New User?</p>
          <Link to="/register" className="btn btn-link">
            Register Here
          </Link>
        </div>
      </form>
      <ToastContainer /> {/* Add ToastContainer here */}
    </div>
  );
};

export default Login;