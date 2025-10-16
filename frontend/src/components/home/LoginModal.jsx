import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../config/axios";
import { UserContext } from "../../context/user.context";
import { FcGoogle } from "react-icons/fc";

const LoginModal = ({ isOpen, onClose, onSignupClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]  = useState(false);
  const [error, setError] = useState(""); // 🧠 New state for showing backend errors

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  function submitHandler(e) {
    e.preventDefault();
    setLoading(true);
    setError(""); // reset previous error

    axios
      .post("/users/login", { email, password })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        navigate("/");
        onClose(); // close modal after login
      })
      .catch((err) => {
        console.error(err.response?.data?.errors || err.message);
        setError(
          err.response?.data?.message ||
          err.response?.data?.errors ||
          "Invalid credentials. Please try again."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // Google OAuth
  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_API_URL;
    const redirectPage = window.location.pathname;
    window.location.href = `${backendUrl}/auth/google?state=${encodeURIComponent(redirectPage)}`;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-gray-900/80 backdrop-blur-md p-4 sm:p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-800 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          ✕
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold mb-5 text-center bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
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
              className={`w-full py-3 px-4 rounded-lg bg-gray-800 text-white border ${
                error ? "border-red-500" : "border-gray-700"
              } focus:outline-none focus:ring-2 ${
                error ? "focus:ring-red-500" : "focus:ring-emerald-500"
              } transition-all text-sm sm:text-base`}
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
              className={`w-full py-3 px-4 rounded-lg bg-gray-800 text-white border ${
                error ? "border-red-500" : "border-gray-700"
              } focus:outline-none focus:ring-2 ${
                error ? "focus:ring-red-500" : "focus:ring-emerald-500"
              } transition-all text-sm sm:text-base`}
            />
            {error && (
              <p className="text-red-400 text-xs mt-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-medium shadow-md transition-all text-sm sm:text-base 
              ${loading 
                ? "bg-gray-700 text-gray-300 cursor-not-allowed" 
                : "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white"
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex items-center my-3">
          <hr className="flex-1 border-gray-700" />
          <span className="px-3 text-gray-400">or</span>
          <hr className="flex-1 border-gray-700" />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleGoogleLogin}
            className="py-2 px-4 flex items-center justify-center gap-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-medium shadow-md transition-all text-sm sm:text-base"
          >
            <FcGoogle className="text-xl" />
            Sign in with Google
          </button>
        </div>

        <p className="text-gray-400 mt-4 text-center text-xs sm:text-sm">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => {
              onClose();
              onSignupClick();
            }}
            className="text-emerald-400 hover:text-cyan-400 font-medium transition-colors"
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
