import React, { useState, useEffect, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "../config/axios";
import { initializeSocket, receiveMessage, sendMessage } from "../config/socket";
import { UserContext } from "../context/user.context";
import AIResponsePanel from "../components/AIResponsePanel";
import AddCollaboratorsModal from "../components/project/AddCollaboratorModal";
import CollaboratorPanel from "../components/project/CollaboratorPanel";
import ConversationArea from "../components/project/chat/ConversationArea";

const Project = () => {
  const location = useLocation();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [project, setProject] = useState(location.state.project);
  const [usersList, setUsersList] = useState([]);
  const [messages, setMessages] = useState([]);

  const [selectedAiMessage, setSelectedAiMessage] = useState(null);

  const { user } = useContext(UserContext);

  // ✅ Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    // 1. Initialize socket
    initializeSocket(project._id);

    // 2. Fetch all existing messages from backend
    axios
      .get(`/projects/${project._id}/allMessages`)
      .then((res) => {
        if (res.data?.messages) {
          setMessages(res.data.messages);
        }
      })
      .catch((err) => {
        console.error("Error fetching messages:", err);
      });


    // 3. Listen for incoming messages via socket
    receiveMessage("project-message", async (data) => {
      console.log("Received:", data);

      // Update UI immediately
      setMessages((prevMessages) => [...prevMessages, data]);

      if (data.sender?.email === "AI" || data.sender?._id === "ai") {
        try {
        //  ->  Save AI responses to DB at generation time , (not here)

        
          // Auto-open AI panel if response has files
          const parsedMessage =
            typeof data.content === "string"
              ? JSON.parse(data.content)
              : data.content;

          if (
            parsedMessage &&
            parsedMessage.fileTree &&
            typeof parsedMessage.fileTree === "object" &&
            Object.keys(parsedMessage.fileTree).length > 0) 
            {
            setIsAiPanelOpen(true);
            setSelectedAiMessage(data);
          }
        } catch (err) {
          console.error("Error saving AI response:", err);
        }
      }
    });


    // 4. Fetch project details
    axios
      .get(`/projects/get-project/${location.state.project._id}`)
      .then((res) => {
        setProject(res.data.project);
      })
      .catch((err) => {
        console.log(err);
      });


    // 5. Fetch all users, those are not in this project yet
    axios
      .get("/users/all", {
        params: { projectId: project._id }, // send projectId
      })
      .then((res) => {
        setUsersList(res.data.users); 
      })
      .catch((err) => {
        console.log(err);
      });

  }, [location.state.project._id, project._id]);

const renderMessage = (message, index) => {
  const isAI = message.sender.email === "AI" || message.sender._id === "ai";
  const isOwnMessage = message.sender?._id.toString() === user._id;

  if (isAI) {
    let displayText = message.content;
    let hasFiles = false;

    try {
      let parsed;
      if (typeof message.content === "string") {
        parsed = JSON.parse(message.content);
      } else if (
        typeof message.content === "object" &&
        message.content !== null
      ) {
        parsed = message.content;
      } else {
        parsed = { text: message.content };
      }

      displayText = parsed.text || message.content;
      hasFiles =
        parsed.fileTree &&
        typeof parsed.fileTree === "object" &&
        Object.keys(parsed.fileTree).length > 0;
    } catch (err) {
      console.log("Error parsing AI message:", err);
      displayText =
        typeof message.content === "string"
          ? message.content
          : JSON.stringify(message.content);
    }

    return (
      <div key={index} className="message flex flex-col relative z-10">
        <small className="opacity-90 text-xs sm:text-sm flex items-center gap-1 mb-1 flex-shrink-0 text-emerald-300">
          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
          {message.sender.email}
        </small>
        <div className="bg-gray-900/90 backdrop-blur-md border border-emerald-400/70 p-4 rounded-r-xl max-w-full text-emerald-100 shadow-xl shadow-emerald-500/20">
          <p className="text-base sm:text-sm leading-relaxed break-words">
            {displayText}
          </p>
          {hasFiles && (
            <button
              onClick={() => {
                setIsAiPanelOpen(true);
                setSelectedAiMessage(message);
              }}
              className="mt-3 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs sm:text-sm hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-md"
            >
              View Files & Code
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      key={index}
      className={`message flex flex-col relative z-10 ${
        isOwnMessage ? "items-end" : "items-start"
      }`}
    >
      <small
        className={`opacity-90 text-xs sm:text-sm mb-1 flex-shrink-0 ${
          isOwnMessage ? "text-blue-300" : "text-gray-100"
        }`}
      >
        {message.sender.email}
      </small>
      <div
        className={`max-w-[85%] p-4 rounded-lg border relative z-10 shadow-xl ${
          isOwnMessage
            ? "bg-blue-900/70 text-white border-blue-400/60 rounded-br-none shadow-blue-500/20"
            : "bg-gray-800/80 text-gray-100 border-white/40 rounded-bl-none"
        }`}
      >
        <p className="text-base sm:text-sm leading-relaxed break-words">
          {message.content}
        </p>
      </div>
    </div>
  );
};


  return (
    <main className="flex-1 flex relative overflow-hidden">
      {/* Chat Section - Fixed width on desktop, full width on mobile when AI panel closed */}
      <section className={`p-2 left relative h-full flex flex-col flex-shrink-0 ${
          // Mobile: full width when AI panel closed, hidden when open
          isAiPanelOpen ? 'hidden lg:flex lg:w-1/4' : 'w-full lg:w-1/4'
        }`}>


        {/* Conversation Area  */}
        <ConversationArea
          messages={messages}
          renderMessage={renderMessage}
          isSidePanelOpen={isSidePanelOpen}
          setIsSidePanelOpen={setIsSidePanelOpen}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          isAiPanelOpen={isAiPanelOpen}
          setIsAiPanelOpen={setIsAiPanelOpen}
          setMessages={setMessages}
          project={project}
        />

        {/* Collaborators Side Panel */}
        <CollaboratorPanel
          isOpen={isSidePanelOpen}
          onClose={() => setIsSidePanelOpen(false)}
          users={project.users}
        />

        {/* Add Collaborator Modal */}
        <AddCollaboratorsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          usersList={usersList}
          projectId={project._id}

          // imp.- to update users in ColllaboratorPanel also , 
          onCollaboratorsUpdated={(newUsers)=>{
            setProject((prev)=>({
              ...prev,
              users: newUsers
            }))
          }}
        />

      </section>


          {/* replacer of ai Response Panel */}
    {
      !isAiPanelOpen && (
        <div className="inset-y-0 mt-20 right flex-1 bg-gray-900 shadow-lg z-40 flex flex-col border-2 border-gray-400 rounded-2xl overflow-hidden relative">
          {/* Image fills div completely */}
          <img
            src="/back.png"
            alt="AI Preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10"></div>     
          {/* Text overlay at top-right */}
          <div className="absolute top-8 right-12">
            <div className="px-6 py-4 rounded-xl">
              <p className="text-4xl font-bold leading-snug bg-gradient-to-r from-cyan-300 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
                AI Response like <span className="text-white"> Code </span> 
                and <span className="text-white">Files </span> 
                will be shown here.
              </p>
            </div>
          </div>
        </div>
      )
    }

      {/* AI Response Panel - Takes remaining space on desktop, full width on mobile */}
      <AIResponsePanel
        message={selectedAiMessage}
        isOpen={isAiPanelOpen}
        onToggle={() => setIsAiPanelOpen(!isAiPanelOpen)}
      />
    </main>
  );
};

export default Project;