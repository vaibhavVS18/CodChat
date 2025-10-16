import React, { useState } from "react";
import axios from "../../config/axios";
import { useNavigate } from "react-router-dom";

const CreateProjectModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState(""); 

  const handleCreate = (e) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    setError(""); // reset before sending request

    axios
      .post("/projects/create", { name: projectName })
      .then((res) => {
        const project = res.data;
        setProjectName("");
        onClose();
        navigate(`/project`, { state: { project } });
      })
      .catch((err) => {
        console.error("Error creating project:", err.response?.data);
        setError(err.response?.data?.message || err.response?.data || "Something went wrong"); 
      });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-gray-900/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-800 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            setProjectName("");
            setError("");
            onClose();
          }}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          ✕
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Create New Project
        </h2>

        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <label
              htmlFor="projectName"
              className="block text-gray-400 mb-2 text-sm font-medium"
            >
              Project Name
            </label>
            <input
              id="projectName"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              className={`w-full py-3 px-4 rounded-lg bg-gray-800 text-white border ${
                error ? "border-red-500" : "border-gray-700"
              } focus:outline-none focus:ring-2 ${
                error ? "focus:ring-red-500" : "focus:ring-emerald-500"
              } transition-all text-sm sm:text-base`}
              required
            />
            {error && (
              <p className="text-red-400 text-xs mt-2">
                {error}
              </p>
            )}
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setProjectName("");
                setError("");
                onClose();
              }}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 rounded-xl text-white font-medium shadow-md hover:shadow-emerald-500/30 transition-all"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
