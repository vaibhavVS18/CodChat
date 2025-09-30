import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/user.context";
import axios from "../../config/axios";

const RegisterModal = ({ isOpen, onClose, onLoginClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  function submitHandler(e) {
    e.preventDefault();
    setLoading(true);

    axios
      .post("/users/register", { email, password })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        navigate("/");
        onClose(); // close modal after register
      })
      .catch((err) => {
        console.log(err.response?.data || err.message);
      })
      .finally(()=>{
        setLoading(false);
      });
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 overflow-y-auto"
      onClick={onClose}
    >
      {/* Modal box */}
      <div
        className="bg-gray-900/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-800 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          ✕
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Create Account
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
              className="w-full py-3 px-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm sm:text-base"
              placeholder="Enter your email"
              required
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
              className="w-full py-3 px-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm sm:text-base"
              placeholder="Enter your password"
              required
            />
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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-gray-400 mt-6 text-center text-xs sm:text-sm">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => {
              onClose();       // close Register modal
              onLoginClick();  // open Login modal
            }}
            className="text-emerald-400 hover:text-cyan-400 font-medium transition-colors"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;
