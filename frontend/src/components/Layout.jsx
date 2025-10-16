import React, { useContext } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/home/Navbar";
import RegisterModal from "../components/home/RegisterModal";
import LoginModal from "../components/home/LoginModal";
import Footer from "../components/home/Footer";

import { UserContext } from "../context/user.context";
import { ModalContext } from "../context/modal.context";

const Layout = () => {
  const { user } = useContext(UserContext);
  const { isRegisterOpen, setIsRegisterOpen, isLoginOpen, setIsLoginOpen } =useContext(ModalContext);

  return (
    
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-950 to-black ">
      {/* Navbar shared across all pages */}
      <Navbar
        user={user}                                           // note- imp. to send ,while we are not using it there
        // onSignupClick={() => setIsRegisterOpen(true)}
        onLoginClick={() => setIsLoginOpen(true)}
      />

      {/* Main page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer shared across all pages */}
      <Footer />

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
      />
    </div>
  );
};

export default Layout;
