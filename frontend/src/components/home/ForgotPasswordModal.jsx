import React, { useState } from "react";
import axios from "../../config/axios";

const ForgotPasswordModal = ({ isOpen, onClose, onLoginClick }) => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const resetForm = () => {
        setEmail("");
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

    // Reset Password
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
            // We'll update the backend to just accept email and new password
            // For now, we're calling the reset endpoint directly
            const res = await axios.post("/auth/forgot-password/reset-password", {
                email,
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

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 overflow-y-auto"
            onClick={handleClose}
        >
            {/* Modal Container */}
            <div
                className="relative my-8 w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-2xl border"
                style={{
                    background: "rgba(15, 23, 42, 0.95)",
                    backdropFilter: "blur(20px)",
                    borderColor: "rgba(148, 163, 184, 0.2)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition cursor-pointer"
                >
                    ✕
                </button>

                {/* Header */}
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
                    Reset Password
                </h2>

                {/* Success Message */}
                {success && (
                    <div className="mb-4 p-3 bg-emerald-900/30 border border-emerald-500/30 rounded-lg">
                        <p className="text-emerald-400 text-sm text-center">{success}</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg">
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    </div>
                )}

                {/* Password Reset Form */}
                <form onSubmit={handleResetPassword} className="space-y-5">
                    <p className="text-gray-400 text-sm text-center mb-4">
                        Enter your email and new password to reset it.
                    </p>

                    <div>
                        <label className="block text-gray-300 mb-2 text-sm font-medium" htmlFor="email">
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
                            className="w-full py-3 px-4 rounded-lg bg-slate-800/50 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all text-sm sm:text-base text-white placeholder-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2 text-sm font-medium" htmlFor="newPassword">
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
                            className="w-full py-3 px-4 rounded-lg bg-slate-800/50 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all text-sm sm:text-base text-white placeholder-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2 text-sm font-medium" htmlFor="confirmPassword">
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
                            className="w-full py-3 px-4 rounded-lg bg-slate-800/50 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all text-sm sm:text-base text-white placeholder-gray-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl font-semibold shadow-md transition-all text-sm sm:text-base cursor-pointer ${loading
                            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-white"
                            }`}
                    >
                        {loading ? "Resetting Password..." : "Reset Password"}
                    </button>
                </form>

                {/* Login Link */}
                <p className="text-gray-400 mt-5 text-center text-sm">
                    Remember your password?{" "}
                    <button
                        type="button"
                        onClick={() => {
                            handleClose();
                            if (onLoginClick) onLoginClick();
                        }}
                        className="text-emerald-400 hover:text-teal-300 font-medium transition-colors cursor-pointer"
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
