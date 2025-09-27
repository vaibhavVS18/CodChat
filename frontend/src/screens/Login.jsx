import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios";
import { UserContext } from "../context/user.context";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  function submitHandler(e) {
    e.preventDefault();

    axios
      .post("/users/login", { email, password })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        navigate("/");
      })
      .catch((err) => {
        console.log(err.response?.data || err.message);
      });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
      <div className="bg-gray-900/70 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Login
        </h2>
        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label
              className="block text-gray-400 mb-2 text-sm font-medium"
              htmlFor="email"
            >
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              placeholder="Enter your email"
              required
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
          <div>
            <label
              className="block text-gray-400 mb-2 text-sm font-medium"
              htmlFor="password"
            >
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              placeholder="Enter your password"
              required
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-medium shadow-md hover:shadow-emerald-500/30 transition-all"
          >
            Login
          </button>
        </form>
        <p className="text-gray-400 mt-6 text-center text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-emerald-400 hover:text-cyan-400 font-medium transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
