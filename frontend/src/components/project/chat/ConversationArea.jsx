import React, { useRef, useEffect, useState, useContext } from "react";
import { sendMessage } from "../../../config/socket";
import axios from "../../../config/axios";
import { UserContext } from "../../../context/user.context";

const ConversationArea = ({
  renderMessage,
  messages,
  isSidePanelOpen,
  setIsSidePanelOpen,
  isModalOpen,
  setIsModalOpen,
  isAiPanelOpen,
  setIsAiPanelOpen,
  setMessages,
  project
}) => {
  const messageBoxRef = useRef(null);
  const [newMessage, setNewMessage] = useState("");
  const {user}  = useContext(UserContext);

  // Auto-scroll to bottom when messages change
    const scrollToBottom = () => {
        if (messageBoxRef.current) {
            messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
        }
    };

      useEffect(() => {
        scrollToBottom();
      }, [messages]);


  const handleSend = async () => {
    if (newMessage.trim() === "") return;

    try {
        // Save in DB
        const res = await axios.post("/projects/add-message", {
        projectId: project._id,
            sender: {
            _id: user._id,       
            email: user.email,   
            },
        content: newMessage,
        });

        // Backend returns updated project, so get last message
        const savedMessage = res.data.project.messages.slice(-1)[0];

        // Emit to other users
        sendMessage("project-message", savedMessage);

        // Add locally
        setMessages((prevMessages) => [...prevMessages, savedMessage]);
        setNewMessage("");
    } catch (err) {
        console.error("Error sending message:", err);
    }
    };

  return (
    <div className="flex flex-col h-[85vh] sm:h-[97vh] overflow-hidden mt-20 sm:mt-0 p-2 sm:p-4 border border-gray-400 rounded-xl sm:rounded-2xl bg-gray z-10">
      {/* Header */}
      <header className="flex justify-between items-center p-2 px-4 w-full backdrop-blur-md border border-gray-400 rounded-xl shadow-sm flex-shrink-0 mb-2">
        <div className="flex items-center gap-3">
          <button
            className="p-2 bg-gray-700/50 hover:bg-gray-600/60 rounded-md text-gray-200 hover:text-emerald-400 transition-all"
            onClick={() => setIsSidePanelOpen((prev) => !prev)}
            title="Show Collaborators"
          >
            <i className="ri-group-fill"></i>
          </button>
          <button
            className="p-2 bg-gray-700/50 hover:bg-gray-600/60 rounded-md text-gray-200 hover:text-emerald-400 transition-all"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="ri-add-fill text-gray-200 hover:text-emerald-300"></i>
            <span className="bg-clip-text from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 font-medium">
              Add
            </span>
          </button>
{project?.name && (
  <span
    className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 font-medium"
    title={project.name}
  >
    {project.name.length > 10 ? project.name.slice(0, 10) + "…" : project.name}
  </span>
)}


        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2 bg-gray-700/50 hover:bg-gray-600/60 rounded-md text-gray-200 hover:text-cyan-400 transition-all"
            onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
            title="Toggle AI Response Panel"
          >
            <i className="ri-robot-fill"></i>
          </button>
        </div>
      </header>

      {/* Messages List */}
      <div
        ref={messageBoxRef}
        className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-hide"
      >
        {messages.map(renderMessage)}
      </div>

{/* Input Box */}
<div className="w-full flex border border-gray-400 bg-gray/80 backdrop-blur-md flex-shrink-0 p-2 sm:p-3 rounded-b-xl">
  <div className="w-full flex items-center gap-2">
    <input
      className="flex-grow px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl outline-none text-sm sm:text-base bg-gray-700 text-white border border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-cyan-300 transition-all"
      type="text"
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleSend();
      }}
      placeholder="Msg (use @ai for AI assistance)"
    />
        <button
            onClick={handleSend}
            className="ml-2 w-12 h-12 flex items-center justify-center 
                        bg-gray border border-gray-200 text-white 
                        rounded-xl transition-all hover:bg-gray-700 shadow-md"
            >
            <i className="ri-send-plane-fill text-lg mt-1"></i>
        </button>
  </div>
</div>


    </div>
  );
};

export default ConversationArea;
