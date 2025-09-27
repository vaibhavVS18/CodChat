// components/CollaboratorsPanel.jsx
import React, { useRef, useEffect } from "react";

const CollaboratorPanel = ({ isOpen, onClose, users }) => {
  const panelRef = useRef(null);

  // Close panel on clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed top-22 sm:top-2 flex flex-col gap-2 w-64 sm:w-72 h-[85vh] sm:h-[97vh] bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-xl shadow-xl transition-all duration-300 z-40 overflow-hidden ${
        isOpen ? "left-2" : "-left-72 sm:-left-80"
      }`}
      ref={panelRef}
    >
      {/* Header */}
      <header className="flex justify-between items-center px-3 py-2 bg-gray-800/80 rounded-t-2xl flex-shrink-0">
        <h1 className="text-gray-100 font-semibold text-lg">Collaborators</h1>
        <button
          onClick={onClose}
          className="p-2 hover:text-red-400 transition"
        >
          <i className="ri-close-fill text-lg"></i>
        </button>
      </header>

      {/* Users List */}
      <div className="flex flex-col gap-2 p-3 overflow-y-auto flex-grow min-h-0">
        {users.map((user, idx) => (
        <div
          key={user._id || idx}
          className="flex items-center gap-3 bg-gray-800/70 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-700/60 transition"
        >
          <i className="ri-user-line text-gray-300 text-xl flex-shrink-0"></i>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 font-medium text-sm truncate min-w-0">
            {user.email}
          </span>
        </div>
        ))}
      </div>
    </div>
  );
};

export default CollaboratorPanel;
