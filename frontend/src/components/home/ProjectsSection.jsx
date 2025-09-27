// components/home/ProjectsSection.jsx
import React, { useContext } from "react";
import { UserContext } from "../../context/user.context";

const ProjectsSection = ({
  projects,
  setIsProjectModalOpen,
  setIsLoginOpen,
  navigate,
}) => {

  const {user} = useContext(UserContext);
  
  return (
    <div className="mb-8">
      <h3 className="text-2xl text-gray-300 font-semibold mb-6 text-center md:text-left">
        Your Projects
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Project Card */}
        <button
          onClick={() => {
            if (user) {
              setIsProjectModalOpen(true);
            } else {
              setIsLoginOpen(true);
            }
          }}
          className="p-6 border-2 border-dashed border-gray-600 hover:border-emerald-500/50 
                    rounded-2xl transition-colors group flex flex-col items-center justify-center"
        >
          <div className="w-12 h-12 bg-gray-700 group-hover:bg-emerald-600/20 
                          rounded-full flex items-center justify-center mb-3 text-gray-400 
                          text-lg font-semibold transition-colors">
            +
          </div>
          <h4 className="font-medium text-gray-300 group-hover:text-emerald-400 transition-colors">
            Create New Project
          </h4>
        </button>

        {/* Existing Projects */}
        {projects.map((project) => (
          <div
            key={project._id}
            className="p-6 bg-gray-800/40 backdrop-blur border border-gray-400 
                      hover:border-emerald-500/40 hover:shadow-lg hover:scale-105 hover:shadow-emerald-500/20
                      rounded-2xl cursor-pointer transition-all group"
            onClick={() => navigate(`/project`, { state: { project } })}
          >
            {/* Profile Circle + Project Name */}
            <div className="flex items-center mb-4 space-x-4">
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {project.name.charAt(0).toUpperCase()}
              </div>
              <h4 className="font-semibold text-lg text-gray-300 group-hover:text-emerald-400 transition-colors">
                {project.name}
              </h4>
            </div>

            {/* Collaborators & Date */}
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                <span>
                  {project.users.length} collaborator
                  {project.users.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="text-xs">
                {new Date(project.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsSection;
