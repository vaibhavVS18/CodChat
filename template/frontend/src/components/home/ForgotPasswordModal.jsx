import React, { useState } from "react";
import axios from "../../config/axios";

const ForgotPasswordModal = ({ isOpen, onClose, onLoginClick }) => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const resetForm = () => {
        setStep(1);
        setEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setError("");
        setSuccess("");
        setLoading(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    // Step 1: Send OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await axios.post("/api/auth/forgot-password/send-otp", { email });
            setSuccess(res.data.message);
            setTimeout(() => {
                setStep(2);
                setSuccess("");
            }, 1500);
        } catch (err) {
            console.error(err.response?.data || err.message);
            setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await axios.post("/api/auth/forgot-password/verify-otp", { email, otp });
            setSuccess(res.data.message);
            setTimeout(() => {
                setStep(3);
                setSuccess("");
            }, 1500);
        } catch (err) {
            console.error(err.response?.data || err.message);
            setError(err.response?.data?.message || "Failed to verify OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        // Validate passwords match
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        // Validate password length
        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters long");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post("/api/auth/forgot-password/reset-password", {
                email,
                otp,
                newPassword,
            });
            setSuccess(res.data.message);
            setTimeout(() => {
                handleClose();
                if (onLoginClick) onLoginClick();
            }, 2000);
        } catch (err) {
            console.error(err.response?.data || err.message);
            setError(err.response?.data?.message || "Failed to reset password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await axios.post("/api/auth/forgot-password/send-otp", { email });
            setSuccess("New OTP sent to your email");
            setOtp("");
        } catch (err) {
            console.error(err.response?.data || err.message);
            setError(err.response?.data?.message || "Failed to resend OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 overflow-y-auto"
            onClick={handleClose}
        >
            {/* Modal Container */}
            <div
                className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md relative my-8 border border-gray-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
                >
                    ✕
                </button>

                {/* Header */}
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
                    Reset Password
                </h2>

                {/* Progress Indicator */}
                <div className="flex justify-center mb-6">
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 1 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            1
                        </div>
                        <div className={`w-12 h-1 ${step >= 2 ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 2 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            2
                        </div>
                        <div className={`w-12 h-1 ${step >= 3 ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 3 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            3
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <p className="text-emerald-700 text-sm text-center">{success}</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm text-center">{error}</p>
                    </div>
                )}

                {/* Step 1: Email Entry */}
                {step === 1 && (
                    <form onSubmit={handleSendOTP} className="space-y-5">
                        <p className="text-gray-600 text-sm text-center mb-4">
                            Enter your email address and we'll send you an OTP to reset your password.
                        </p>
                        <div>
                            <label className="block text-gray-600 mb-2 text-sm font-medium" htmlFor="email">
                                Email Address
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
                                className="w-full py-3 px-4 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all text-sm sm:text-base"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-xl font-semibold shadow-md transition-all text-sm sm:text-base ${loading
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                    : "bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-white"
                                }`}
                        >
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                    </form>
                )}

                {/* Step 2: OTP Verification */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOTP} className="space-y-5">
                        <p className="text-gray-600 text-sm text-center mb-4">
                            We've sent a 6-digit OTP to <strong>{email}</strong>. Please enter it below.
                        </p>
                        <div>
                            <label className="block text-gray-600 mb-2 text-sm font-medium" htmlFor="otp">
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
                                pattern="\d{6}"
                                className="w-full py-3 px-4 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all text-sm sm:text-base text-center tracking-widest font-semibold"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-xl font-semibold shadow-md transition-all text-sm sm:text-base ${loading
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                    : "bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-white"
                                }`}
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>

                        <div className="flex justify-between items-center text-sm">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                ← Back
                            </button>
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={loading}
                                className="text-emerald-600 hover:text-teal-500 font-medium transition-colors disabled:opacity-50"
                            >
                                Resend OTP
                            </button>
                        </div>
                    </form>
                )}

                {/* Step 3: Password Reset */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <p className="text-gray-600 text-sm text-center mb-4">
                            Enter your new password below.
                        </p>
                        <div>
                            <label className="block text-gray-600 mb-2 text-sm font-medium" htmlFor="newPassword">
                                New Password
                            </label>
                            <input
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    setError("");
                                }}
                                value={newPassword}
                                type="password"
                                id="newPassword"
                                placeholder="Enter new password"
                                required
                                minLength={8}
                                className="w-full py-3 px-4 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all text-sm sm:text-base"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 mb-2 text-sm font-medium" htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <input
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setError("");
                                }}
                                value={confirmPassword}
                                type="password"
                                id="confirmPassword"
                                placeholder="Confirm new password"
                                required
                                minLength={8}
                                className="w-full py-3 px-4 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all text-sm sm:text-base"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-xl font-semibold shadow-md transition-all text-sm sm:text-base ${loading
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                    : "bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-white"
                                }`}
                        >
                            {loading ? "Resetting Password..." : "Reset Password"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="w-full text-gray-600 hover:text-gray-800 transition-colors text-sm"
                        >
                            ← Back
                        </button>
                    </form>
                )}

                {/* Login Link */}
                <p className="text-gray-500 mt-5 text-center text-sm">
                    Remember your password?{" "}
                    <button
                        type="button"
                        onClick={() => {
                            handleClose();
                            if (onLoginClick) onLoginClick();
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

export default ForgotPasswordModal;
