import { useContext, useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../config/axios";
import { UserContext } from "../../context/user.context"; // adjust path

export default function Navbar({ onSignupClick }) {
  const { user, setUser } = useContext(UserContext); // use context directly
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("/users/logout");
      localStorage.removeItem("token");
      setUser(null); // ✅ context updates, Navbar re-renders instantly
      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <header className="pointer-events-none fixed top-0 w-full flex justify-center z-100">
      <div className="pointer-events-auto w-full sm:w-1/2 bg-gray-900/50 backdrop-blur-md border border-gray-100/70 rounded-none sm:rounded-2xl shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo + Title */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-500/90 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <Link
                to="/"
                className="text-xl font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent hover:from-emerald-300 hover:to-cyan-300 transition-all"
              >
                CodChat
              </Link>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4 relative" ref={menuRef}>
                        <button
                      className="text-gray-100 hover:text-emerald-400 transition-colors"
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
              {user ? (
                <>
                  {/* Profile Circle Button */}
                  <button
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500 hover:border-cyan-400 transition-all"
                  >
                    <img
                      src="/profile.png"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <div className="absolute top-12 right-0 w-40 bg-gray-900 border border-gray-700 rounded-xl shadow-lg py-2 z-50">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate("/", { replace: true }); // go to home
                        setTimeout(() => {
                          window.scrollTo({
                            top: document.body.scrollHeight,
                            behavior: "smooth",
                          });
                        }, 50); // small delay to allow page to render
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-emerald-400 transition-all"
                    >
                      My Projects
                    </button>

                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-red-400 transition-all"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={onSignupClick}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-medium shadow-md hover:shadow-emerald-500/30 transition-all"
                >
                  Signup
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
