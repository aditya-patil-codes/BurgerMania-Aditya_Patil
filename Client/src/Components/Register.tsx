import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css"; 

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://localhost:7126/api/Auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          passwordHash: password,
          role: "user",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Registration failed. Please try again."
        );
      }

      toast.success("Registration successful! Please log in.");

      setUsername("");
      setPassword("");
      setTimeout(() => {
        navigate("/");
      }, 1000); 
    } catch (error: any) {
      setError(error.message || "Registration failed. Please try again.");
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
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
        onSubmit={handleRegister}
        className="bg-white p-5 rounded shadow"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2 className="text-center mb-4">Register</h2>
        {error && <div className="alert alert-danger">{error}</div>}
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
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
        <div className="text-center d-flex justify-content-center align-items-center">
          <p className="mb-0 mr-2">Already Registered?</p>
          <Link to="/login" className="btn btn-link">
            Login Here
          </Link>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Register;