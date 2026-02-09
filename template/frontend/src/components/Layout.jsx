import React, { useContext } from "react";
import { Outlet } from "react-router-dom";

import { UserContext } from "../context/user.context";
import { ModalContext } from "../context/modal.context.jsx";

import Navbar from "./home/Navbar";
import Footer from "./home/Footer";
import RegisterModal from "./home/RegisterModal.jsx";
import LoginModal from "./home/LoginModal.jsx";
import ForgotPasswordModal from "./home/ForgotPasswordModal.jsx";


const Layout = () => {
    const { user } = useContext(UserContext);
    const {
        isRegisterOpen,
        setIsRegisterOpen,
        isLoginOpen,
        setIsLoginOpen,
        isForgotPasswordOpen,
        setIsForgotPasswordOpen
    } = useContext(ModalContext);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar shared across all pages */}
            <Navbar
                user={user}
                // onSignupClick={() => setIsRegisterOpen(true)}
                onLoginClick={() => setIsLoginOpen(true)}
            />

            {/* Main page content */}
            <main className="flex-1 w-full overflow-x-hidden">
                <Outlet />
            </main>

            {/* Footer shared across all pages */}
            <Footer
                onLoginClick={() => setIsLoginOpen(true)}
            />

            {/* Global Modals */}
            <RegisterModal
                isOpen={isRegisterOpen}
                onClose={() => setIsRegisterOpen(false)}
                onLoginClick={() => setIsLoginOpen(true)}
            />

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onSignupClick={() => setIsRegisterOpen(true)}
                onForgotPasswordClick={() => setIsForgotPasswordOpen(true)}
            />

            <ForgotPasswordModal
                isOpen={isForgotPasswordOpen}
                onClose={() => setIsForgotPasswordOpen(false)}
                onLoginClick={() => setIsLoginOpen(true)}
            />

        </div>

    )
}

export default Layout;