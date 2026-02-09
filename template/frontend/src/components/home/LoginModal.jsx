import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
import axios from "../../config/axios";
import { UserContext } from "../../context/user.context";
import { FcGoogle } from "react-icons/fc";

const LoginModal = ({ isOpen, onClose, onSignupClick, onForgotPasswordClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setUser } = useContext(UserContext);
  //   const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    axios
      .post("/api/users/login", { email, password })
      .then((res) => {
        console.log(res.data.token);
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        // navigate("/");
        onClose();
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        setError(
          err.response?.data ||
          err.response?.data?.errors ||
          "Something went wrong. Please try again."
        );
      })
      .finally(() => setLoading(false));
  };

  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_API_URL;
    const redirectPage = window.location.pathname;
    window.location.href = `${backendUrl}/api/auth/google?state=${encodeURIComponent(
      redirectPage
    )}`;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 overflow-y-auto"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md relative my-8 border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
          Login
        </h2>

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label
              className="block text-gray-600 mb-2 text-sm font-medium"
              htmlFor="email"
            >
              Email
            </label>
            <input
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              type="email"
              id="email"
              placeholder="Enter your email"
              required
              className={`w-full py-3 px-4 rounded-lg bg-gray-50 border text-emerald-800 text-sm sm:text-base
                            ${error ? "border-red-600" : "border-gray-300"} focus:outline-none focus:ring-2
                            ${error ? "focus:ring-red-600" : "focus:ring-emerald-400"} transition-all 
                        `}
            />
          </div>

          <div>
            <label
              className="block text-gray-600 mb-2 text-sm font-medium"
              htmlFor="password"
            >
              Password
            </label>
            <input
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              type="password"
              id="password"
              placeholder="Enter your password"
              required
              className={`w-full py-3 px-4 rounded-lg bg-gray-50 border text-emerald-800 text-sm sm:text-base
                            ${error ? "border-red-600" : "border-gray-300"} focus:outline-none focus:ring-2
                            ${error ? "focus:ring-red-600" : "focus:ring-emerald-400"} transition-all 
                        `}
            />

            {error && (
              <p className="text-red-600 text-xs mt-2">{error}</p>
            )}

            {/* Forgot Password Link */}
            <div className="text-right mt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onForgotPasswordClick) onForgotPasswordClick();
                }}
                className="text-sm text-emerald-600 hover:text-teal-500 font-medium transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold shadow-md transition-all text-sm sm:text-base ${loading
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-white"
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-1 border-gray-300" />
          <span className="px-3 text-gray-400">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Google Login */}
        <div className="flex justify-center">
          <button
            onClick={handleGoogleLogin}
            className="py-2.5 px-5 flex items-center justify-center gap-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium shadow-sm border border-gray-300 transition-all text-sm sm:text-base"
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </button>
        </div>

        {/* Signup Link */}
        <p className="text-gray-500 mt-5 text-center text-sm">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => {
              onClose();
              onSignupClick();
            }}
            className="text-emerald-600 hover:text-teal-500 font-medium transition-colors"
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
