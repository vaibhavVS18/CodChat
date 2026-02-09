import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../config/axios";
import { UserContext } from "../../context/user.context";
import { User, LogOut } from "lucide-react";

const Navbar = ({ onLoginClick }) => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/api/users/logout");
      localStorage.removeItem("token");
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-11 object-contain"
          />
        </Link>

        {/* Auth Section */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Profile */}
              <Link
                to="/profile"
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500"
              >
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg
                           bg-red-500 hover:bg-red-400 text-white font-medium"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <button
                onClick={onLoginClick}
                className="px-5 py-2 rounded-lg bg-emerald-500
                           hover:bg-emerald-400 text-white font-medium"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
