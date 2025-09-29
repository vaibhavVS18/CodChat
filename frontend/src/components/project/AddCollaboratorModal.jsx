// components/AddCollaboratorsModal.jsx
import React, { useState } from "react";
import axios from "../../config/axios";

const AddCollaboratorsModal = ({ isOpen, onClose, usersList, projectId, onCollaboratorsUpdated }) => {
  if (!isOpen) return null;

  const [selectedUserIds, setSelectedUserIds] = useState([]);

  
  const addCollaborators = () => {
    axios
      .put("/projects/add-user", {
        projectId,
        users: selectedUserIds,
      })
      .then((res) => {
        if(res.data?.updatedProject){
          onCollaboratorsUpdated(res.data.updatedProject.users)
          onClose(); // close modal after adding
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleUserSelection = (id) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-gray-900/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-800 relative my-8 flex flex-col gap-4 max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Select Collaborators
        </h2>

        {/* Users list */}
        <div className="flex flex-col gap-2 overflow-y-auto flex-grow min-h-0">
          {usersList.map((user) => (
            <label
              key={user._id}
              className="flex items-center gap-2 cursor-pointer p-2 rounded-xl hover:bg-gray-800/50 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedUserIds.includes(user._id)}
                onChange={() => toggleUserSelection(user._id)}
                className="accent-cyan-500 w-4 h-4"
              />
              <i className="ri-user-line text-gray-300 flex-shrink-0"></i>
              <span className="text-gray-200 text-sm truncate min-w-0">
                {user.email}
              </span>
            </label>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm transition-all"
          >
            Cancel
          </button>
          <button
            onClick={addCollaborators}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white text-sm shadow-md hover:shadow-cyan-500/30 transition-all"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCollaboratorsModal;
