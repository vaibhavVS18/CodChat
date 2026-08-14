import React, { useRef, useState, useEffect } from "react";
import axios from "../../config/axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiAlertCircle, FiX, FiSend, FiLoader } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const CONTACT_EMAIL = "vaibhav.iiituna1111@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/vaibhav-sharma-90619a291/";

const Contact = () => {
    const form = useRef();
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState(null); // { type: "success" | "error", message?: string }

    const sendEmail = async (e) => {
        e.preventDefault();
        if (isSending) return;
        setIsSending(true);

        const data = new FormData(form.current);

        try {
            await axios.post("/contact/send", {
                name: data.get("user_name"),
                email: data.get("user_email"),
                message: data.get("message"),
            });
            setStatus({ type: "success" });
            form.current.reset();
        } catch (err) {
            console.error(err);
            setStatus({
                type: "error",
                message: err.response?.data?.message,
            });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <section
            id="contact"
            className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 border-t border-gray-700 scroll-mt-24"
        >
            <motion.div
                className="max-w-3xl mx-auto text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                    Get in <span className="text-emerald-400">Touch</span>
                </h2>
                <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                    Questions, feedback, or ideas for CodChat? Drop a message and I'll get
                    back to you.
                </p>

                <motion.form
                    ref={form}
                    onSubmit={sendEmail}
                    className="p-6 sm:p-8 rounded-2xl bg-gray-900 border border-emerald-500/40 shadow-lg space-y-5 text-left"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                >
                    <input
                        type="text"
                        name="user_name"
                        placeholder="Your Name"
                        required
                        maxLength={100}
                        disabled={isSending}
                        className="w-full p-4 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40 transition-all disabled:opacity-60"
                    />

                    <input
                        type="email"
                        name="user_email"
                        placeholder="Your Email"
                        required
                        disabled={isSending}
                        className="w-full p-4 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40 transition-all disabled:opacity-60"
                    />

                    <textarea
                        name="message"
                        rows="5"
                        placeholder="Your Message"
                        required
                        maxLength={5000}
                        disabled={isSending}
                        className="w-full p-4 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40 transition-all resize-y disabled:opacity-60"
                    />

                    <motion.button
                        type="submit"
                        disabled={isSending}
                        whileHover={isSending ? {} : { scale: 1.02 }}
                        whileTap={isSending ? {} : { scale: 0.98 }}
                        className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-500/30 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isSending ? (
                            <>
                                <FiLoader className="animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <FiSend />
                                Send Message
                            </>
                        )}
                    </motion.button>
                </motion.form>

                {/* Direct contact options */}
                <motion.div
                    className="mt-8 flex flex-col items-center gap-5"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    <div className="flex w-full max-w-sm items-center gap-3">
                        <div className="h-px flex-1 bg-gray-700" />
                        <span className="text-xs uppercase tracking-wider text-gray-500">
                            or reach me directly
                        </span>
                        <div className="h-px flex-1 bg-gray-700" />
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <a
                            href={`mailto:${CONTACT_EMAIL}`}
                            className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white/20 break-all"
                        >
                            <MdEmail className="text-xl text-emerald-300 shrink-0" />
                            {CONTACT_EMAIL}
                        </a>

                        <a
                            href={LINKEDIN_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white/20"
                        >
                            <span className="relative inline-flex">
                                {/* White fill behind the icon so the knocked-out "in" reads white */}
                                <span className="pointer-events-none absolute inset-[7%] rounded-[15%] bg-white" />
                                <FaLinkedin className="relative text-xl text-[#0A66C2]" />
                            </span>
                            LinkedIn
                        </a>
                    </div>
                </motion.div>
            </motion.div>

            <StatusModal status={status} onClose={() => setStatus(null)} />
        </section>
    );
};

// Success / error modal shown after the contact form is submitted
const StatusModal = ({ status, onClose }) => {
    useEffect(() => {
        if (!status) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = "";
        };
    }, [status, onClose]);

    const isSuccess = status?.type === "success";

    return (
        <AnimatePresence>
            {status && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Card */}
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="status-modal-title"
                        className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-emerald-500/30 bg-gray-900 p-8 text-center shadow-2xl"
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.95, y: 10, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        {/* Glass shine */}
                        <motion.div
                            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{ duration: 1.4, delay: 0.2, ease: "easeInOut" }}
                        />

                        <button
                            onClick={onClose}
                            aria-label="Close"
                            className="absolute right-3 top-3 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                        >
                            <FiX className="text-lg" />
                        </button>

                        {/* Icon */}
                        <motion.div
                            className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border ${isSuccess
                                ? "border-emerald-400/30 bg-emerald-500/15"
                                : "border-red-400/30 bg-red-500/15"
                                }`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 18 }}
                        >
                            {isSuccess ? (
                                <FiCheckCircle className="text-3xl text-emerald-400" />
                            ) : (
                                <FiAlertCircle className="text-3xl text-red-400" />
                            )}
                        </motion.div>

                        <h3
                            id="status-modal-title"
                            className="mb-2 text-xl font-semibold text-white"
                        >
                            {isSuccess ? "Message Sent!" : "Something Went Wrong"}
                        </h3>

                        <p className="mb-6 text-sm leading-relaxed text-gray-400">
                            {isSuccess
                                ? "Thanks for reaching out — your message landed in my inbox. I'll get back to you soon."
                                : status?.message ||
                                `Your message couldn't be sent right now. Please try again, or email me directly at ${CONTACT_EMAIL}.`}
                        </p>

                        <button
                            onClick={onClose}
                            className="w-full rounded-lg border border-emerald-500/40 bg-emerald-500/10 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-emerald-500/20 cursor-pointer"
                        >
                            {isSuccess ? "Done" : "Close"}
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Contact;
