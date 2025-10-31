import React, { useContext, useState, useEffect } from "react";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";
import CreateProjectModal from "../components/home/CreateProjectModal";
import ProjectsSection from "../components/home/ProjectsSection.jsx";
import { UserContext } from "../context/user.context";
import { ModalContext } from "../context/modal.context.jsx";

import FeatureCarousel from "../components/home/FeatureCarousel.jsx";
const Home = () => {
  const [projects, setProjects] = useState([]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const { user , setUser} = useContext(UserContext);
  const { setIsLoginOpen } = useContext(ModalContext);

  const navigate = useNavigate();

  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);   // it gives query string part of the url
    const token = params.get("token");
    const redirectPage= params.get("redirectPage");
    console.log(redirectPage);

    if (token) {
      // Save token in localStorage
      localStorage.setItem("token", token);

      // Clean URL
      // window.history.replaceState({}, document.title, redirectPage);

      // Navigate to original page
      navigate(redirectPage, { replace: true });
    }
  }, []);     // [setUser, navigate]

  

  const fetchProjects = () => {
    axios
      .get("/projects/all")
      .then((res) => setProjects(res.data.projects))
      .catch((err) => console.log(err));
  };

  // fetch projects only when logged in
  useEffect(() => {
    if (user) fetchProjects();
    else setProjects([]); // clear projects on logout
  }, [user]);

  return (
    <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
      {/* Hero Section */}
      <div className="text-center mb-14">
        <h2 className="text-5xl text-white/85 font-bold mb-4 tracking-tight">
          Build Together,{" "}
          <span className="text-emerald-400">Ship Faster</span>
        </h2>
        <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
          The collaborative development platform where teams code, chat, and
          create with AI assistance in real-time.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => {
            if (user) {
              setIsProjectModalOpen(true);
            } else {
              setIsLoginOpen(true);
            }
          }}
          className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-lg font-medium 
                     shadow-md hover:shadow-emerald-500/30 transition-all inline-flex items-center space-x-2"
        >
          <span>Start New Project</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>


        <div className="w-80 sm:w-64 md:w-150 mx-auto mt-12">
          <FeatureCarousel/>
        </div>
      </div>


      {/* Feature section */}
      <section className="mb-16 px-4 sm:px-6 lg:px-12">
        <h2 className="text-3xl sm:text-4xl text-gray-300 font-bold text-center mb-10">
          Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* 1. Team Collaboration */}
          <div
            tabIndex={0}
            className="rounded-2xl overflow-hidden
                      transition-transform 
                      hover:shadow-xl focus:shadow-xl active:shadow-xl
                      bg-gray-900 border border-emerald-500"
          >
            <img
              src="/feature1.png"
              alt="Team Collaboration"
              className="w-full h-64 sm:h-70 object-cover"
            />
            <div className="p-4 sm:p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Team Collaboration</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Invite collaborators and work together in real-time on your projects.
              </p>
            </div>
          </div>

          {/* 2. Integrated Chat */}
          <div
            tabIndex={0}
            className="rounded-2xl overflow-hidden
                      transition-transform 
                      hover:shadow-xl focus:shadow-xl active:shadow-xl
                      bg-gray-900 border border-emerald-500"
          >
            <img
              src="/feature2.png"
              alt="Integrated Chat"
              className="w-full h-64 sm:h-70 object-cover"
            />
            <div className="p-4 sm:p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Integrated Chat</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Chat with your team members directly within the platform while coding.
              </p>
            </div>
          </div>

          {/* 3. AI Assistant */}
          <div
            tabIndex={0}
            className="rounded-2xl overflow-hidden
                      transition-transform 
                      hover:shadow-xl focus:shadow-xl active:shadow-xl
                      bg-gray-900 border border-emerald-500"
          >
            <img
              src="/feature3.png"
              alt="AI Assistant"
              className="w-full h-64 sm:h-70 object-cover"
            />
            <div className="p-4 sm:p-6">
              <h3 className="text-xl font-semibold text-white mb-2">AI Assistant</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Get instant help from AI that participates in your team chat and assists with coding.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* Projects Section */}
      <ProjectsSection
        projects={projects}
        user={user}
        setIsProjectModalOpen={setIsProjectModalOpen}
        setIsLoginOpen={setIsLoginOpen}
        navigate={navigate}
      />

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
    </main>
  );
};

export default Home;
