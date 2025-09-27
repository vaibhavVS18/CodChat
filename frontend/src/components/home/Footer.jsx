import React from "react";
import { useNavigate } from "react-router-dom";
const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gradient-to-b from-gray-950 via-black to-black text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        
        {/* Left Side - Logo/Name */}
        <div className="flex items-center space-x-2">
          <svg
            className="w-6 h-6 text-emerald-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-white font-semibold">codChat</span>
        </div>

        {/* Middle - Links */}
        <div className="flex space-x-6 text-sm">
          <button
            className="text-gray-300 hover:text-emerald-400 transition-colors"
            onClick={(e) => {
              navigate("/", { replace: true }); // go to home
              const topPosition = window.innerWidth >= 768 ? 650 : 550; // PC : Mobile
              setTimeout(() => {
                window.scrollTo({
                  top: topPosition,
                  behavior: "smooth",
                });
              }, 50); // scroll after page renders
            }}
          >
            Features
          </button>

          <a href="#" className="hover:text-emerald-400 transition-colors">
            Contact
          </a>
        </div>

        {/* Right Side - Social Icons */}
        <div className="flex space-x-4">
          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/vaibhav-sharma-90619a291/"
            className="hover:text-emerald-400 transition-colors"
            aria-label="LinkedIn"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 5 2.12 5 3.5zM.5 8h4V24h-4V8zm7.5 0h3.6v2.2h.05c.5-.95 1.75-2 3.6-2 3.85 0 4.55 2.5 4.55 5.8V24h-4v-7.9c0-1.9-.05-4.3-2.65-4.3-2.65 0-3.05 2.05-3.05 4.15V24h-4V8z" />
            </svg>
          </a>
          {/* GitHub */}
          <a
            href="https://github.com/vaibhavVS18"
            className="hover:text-emerald-400 transition-colors"
            aria-label="GitHub"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M12 2a10 10 0 00-3.16 19.49c.5.1.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.18-1.13-1.5-1.13-1.5-.93-.64.07-.63.07-.63 1.03.07 1.57 1.06 1.57 1.06.91 1.56 2.38 1.11 2.96.85.09-.66.36-1.11.66-1.37-2.22-.25-4.55-1.11-4.55-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.28.1-2.66 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8a9.56 9.56 0 012.5.34c1.9-1.29 2.74-1.02 2.74-1.02.55 1.38.2 2.41.1 2.66.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.37.32.7.95.7 1.91v2.84c0 .26.18.58.69.48A10 10 0 0012 2z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Bottom small text */}
      <div className="text-center text-xs text-gray-500 border-t border-gray-800 py-3">
        Created by <span className="text-emerald-400">V@ibh@V</span> • © {new Date().getFullYear()} codChat
      </div>
    </footer>
  );
};

export default Footer;
