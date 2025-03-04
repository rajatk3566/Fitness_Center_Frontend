// src/Auth/login.tsx
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import bgimage from "@src/assets/bgimage.jpg";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
        email: formData.email,
        password: formData.password,
      });

      console.log("API Response:", response.data);
      localStorage.setItem("token", response.data.access || response.data.token);
      localStorage.setItem("is_admin", JSON.stringify(response.data.is_admin));

      setTimeout(() => {
        const isAdmin = localStorage.getItem("is_admin") === "true";
        navigate(isAdmin ? "/adminhome" : "/userhome");
      }, 500);
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6 sm:p-10 relative"
      style={{ backgroundImage: `url(${bgimage})` }}
    >
      <nav className="absolute top-0 left-0 w-full flex justify-between items-center p-4 text-white">
        <h2 className="text-2xl font-bold text-red-400">Gym Trainer</h2>
        <div className="flex space-x-4">
          <Link to="/" className="hover:text-red-500">Home</Link>
          <Link to="/register" className="hover:text-red-500">Register</Link>
        </div>
      </nav>
      <div className="bg-white/20 p-8 rounded-lg shadow-lg w-full max-w-sm backdrop-blur-md mt-16">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          {[
            { name: "email", type: "email", placeholder: "Email" },
            { name: "password", type: "password", placeholder: "Password" }
          ].map(({ name, type, placeholder }) => (
            <input
              key={name}
              type={type}
              name={name}
              value={formData[name as keyof typeof formData]}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 bg-white/30 text-white placeholder-gray-200"
              placeholder={placeholder}
              required
            />
          ))}
          <button type="submit" className="w-full bg-[#003465] text-white py-2 rounded hover:bg-blue-800 transition duration-200">
            Login
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-white">
          <span>Don't have an account? </span>
          <Link to="/register" className="font-semibold underline">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;