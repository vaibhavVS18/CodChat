import React, { useState, useContext, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/user.context";
import axios from "../../config/axios";
import { FcGoogle } from "react-icons/fc";

const RegisterModal = ({ isOpen, onClose, onLoginClick }) => {
  const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter OTP & Password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(0);

  const { setUser } = useContext(UserContext);
  // const navigate = useNavigate();

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setEmail("");
      setPassword("");
      setOtp("");
      setError("");
      setSuccessMessage("");
      setCountdown(0);
    }
  }, [isOpen]);

  // Step 1: Send OTP
  function sendOTPHandler(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    axios
      .post("/api/users/send-otp", { email })
      .then((res) => {
        setSuccessMessage(res.data.message || "OTP sent successfully!");
        setStep(2);
        setCountdown(60); // 60 seconds countdown
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        setError(
          err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          "Failed to send OTP. Please try again."
        );
      })
      .finally(() => setLoading(false));
  }

  // Resend OTP
  function resendOTPHandler() {
    if (countdown > 0) return;

    setLoading(true);
    setError("");
    setSuccessMessage("");

    axios
      .post("/api/users/send-otp", { email })
      .then((res) => {
        setSuccessMessage("OTP resent successfully!");
        setCountdown(60);
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        setError(
          err.response?.data?.message ||
          "Failed to resend OTP. Please try again."
        );
      })
      .finally(() => setLoading(false));
  }

  // Step 2: Complete Registration with OTP
  function submitHandler(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    axios
      .post("/api/users/register", { email, password, otp })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        setSuccessMessage("Registration successful!");
        setTimeout(() => {
          onClose();
        }, 1000);
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        setError(
          err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          err.response?.data ||
          "Registration failed. Please try again."
        );
      })
      .finally(() => setLoading(false));
  }

  // Google OAuth
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
      <div
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md relative my-8 border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
          Create Account
        </h2>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-emerald-700 text-sm text-center">{successMessage}</p>
          </div>
        )}

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={sendOTPHandler} className="space-y-5">
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
                value={email}
                type="email"
                id="email"
                placeholder="Enter your email"
                required
                className={`w-full py-3 px-4 rounded-lg bg-gray-50 border text-emerald-800 text-sm sm:text-base
                            ${error ? "border-red-600" : "border-gray-300"} focus:outline-none focus:ring-2
                            ${error ? "focus:ring-red-600" : "focus:ring-emerald-400"} transition-all 
                        `}
              />
              {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold shadow-md transition-all text-sm sm:text-base 
              ${loading
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-white"
                }`}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2: Enter OTP & Password */}
        {step === 2 && (
          <form onSubmit={submitHandler} className="space-y-5">
            {/* Email Display */}
            <div>
              <label className="block text-gray-600 mb-2 text-sm font-medium">
                Email
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  disabled
                  className="flex-1 py-3 px-4 rounded-lg bg-gray-100 border border-gray-300 text-gray-600 text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-emerald-600 hover:text-teal-500 text-sm font-medium whitespace-nowrap"
                >
                  Change
                </button>
              </div>
            </div>

            {/* OTP Input */}
            <div>
              <label
                className="block text-gray-600 mb-2 text-sm font-medium"
                htmlFor="otp"
              >
                OTP Code
              </label>
              <input
                onChange={(e) => {
                  setOtp(e.target.value);
                  setError("");
                }}
                value={otp}
                type="text"
                id="otp"
                placeholder="Enter 6-digit OTP"
                required
                maxLength={6}
                pattern="[0-9]{6}"
                className={`w-full py-3 px-4 rounded-lg bg-gray-50 border text-emerald-800 text-sm sm:text-base tracking-widest text-center font-semibold
                            ${error ? "border-red-600" : "border-gray-300"} focus:outline-none focus:ring-2
                            ${error ? "focus:ring-red-600" : "focus:ring-emerald-400"} transition-all 
                        `}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">Check your email for OTP</p>
                <button
                  type="button"
                  onClick={resendOTPHandler}
                  disabled={countdown > 0 || loading}
                  className={`text-xs font-medium ${countdown > 0 || loading
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-emerald-600 hover:text-teal-500"
                    }`}
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                </button>
              </div>
            </div>

            {/* Password Input */}
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
                value={password}
                type="password"
                id="password"
                placeholder="Enter your password"
                required
                className={`w-full py-3 px-4 rounded-lg bg-gray-50 border text-emerald-800 text-sm sm:text-base
                            ${error ? "border-red-600" : "border-gray-300"} focus:outline-none focus:ring-2
                            ${error ? "focus:ring-red-600" : "focus:ring-emerald-400"} transition-all 
                        `}
              />
              {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold shadow-md transition-all text-sm sm:text-base 
              ${loading
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-white"
                }`}
            >
              {loading ? "Registering..." : "Complete Registration"}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-1 border-gray-300" />
          <span className="px-3 text-gray-400">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Google Signup */}
        <div className="flex justify-center">
          <button
            onClick={handleGoogleLogin}
            className="py-2.5 px-5 flex items-center justify-center gap-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium shadow-sm border border-gray-300 transition-all text-sm sm:text-base"
          >
            <FcGoogle className="text-xl" />
            Sign up with Google
          </button>
        </div>

        {/* Login Redirect */}
        <p className="text-gray-500 mt-5 text-center text-sm">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => {
              onClose();
              onLoginClick();
            }}
            className="text-emerald-600 hover:text-teal-500 font-medium transition-colors"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;
