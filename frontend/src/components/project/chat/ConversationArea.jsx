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
  const [sending, setSending] = useState(false); 
  const { user } = useContext(UserContext);

  const [aiMode, setAiMode] =useState(false);


  const scrollToBottom = () => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (newMessage.trim() === "" || sending) return; // avoid double send
    setSending(true);

    try {
      const res = await axios.post("/projects/add-message", {
        projectId: project._id,
        sender: {
          _id: user._id,
          email: user.email,
        },
        content: newMessage,
      });

      const savedMessage = res.data.project.messages.slice(-1)[0];
      sendMessage("project-message", savedMessage);

      setMessages((prevMessages) => [...prevMessages, savedMessage]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  const checkAI= ()=>{
    if(newMessage.startsWith("@ai")){
      return true;
    }
    else return false;
  }

  return (

    <div className="flex flex-col h-[82vh] sm:h-[97vh] overflow-hidden mt-20 sm:mt-0 p-2 sm:p-3 border border-gray-400 rounded-xl sm:rounded-2xl bg-gray-800 z-10">
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

      {/* Messages */}
      <div
        ref={messageBoxRef}
        className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-hide"
      >
        {messages.map(renderMessage)}
      </div>

      {/* Input Box */}
      <div className="w-full flex border border-gray-400 bg-gray/80 backdrop-blur-md flex-shrink-0 p-2 rounded-b-xl">
        <div className="w-full flex flex-col items-center gap-2">
          <div className="flex w-full items-center">
            <div className="flex flex-1 items-center justify-center">
              <button
                onClick={() => {
                  setNewMessage("@ai make a calculator frontend project");
                }}
                className="px-2 py-1 rounded-xl text-sm font-medium bg-blue-900/70 hover:bg-blue-700 text-gray-100 border border-gray-500 transition-all shadow-sm"
                title="Try an AI example"
              >
                <span>Try: </span>
                 @ai make a calculator frontend project
              </button>
            </div>
          </div>


          <div className="flex items-center w-full gap-2">
            <div>
              <button
                onClick={() => {
                  setAiMode((prev) => !prev);
                  if(! checkAI()){
                    setNewMessage(`@ai ${newMessage}`);
                  } 
                  else{
                    const temp = newMessage.slice(4);
                    setNewMessage(temp);
                  }
                }}
                className={`px-2 py-1.5 rounded-xl font-medium text-sm sm:text-base transition-all shadow-sm border 
                  ${checkAI()
                    ? "bg-emerald-600 text-white border-emerald-400 hover:bg-emerald-500"
                    : "bg-gray-700/70 text-gray-200 border-emerald-400 hover:bg-gray-600"}`}
                title="Toggle AI Mode"
                disabled={sending}
              >
                {/* {aiMode ? "Turn Off AI" : "Turn On AI"} */}
                AI
              </button>
            </div>

            <input
              className={`flex-grow px-3 sm:px-4 py-3 sm:py-2 rounded-xl outline-none text-sm sm:text-base 
                bg-gray-700 text-white border border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-cyan-300 transition-all
                ${sending ? "opacity-60 cursor-not-allowed" : ""}`}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              placeholder="Msg (use @ai for AI assistance)"
              disabled={sending}
            />

            <button
              onClick={handleSend}
              disabled={sending}
              className={`flex items-center justify-center px-2  rounded-xl border border-gray-200 text-white transition-all shadow-md 
                ${sending ? "bg-gray-600 cursor-not-allowed" : "bg-gray hover:bg-gray-700"}`}
            >
              {sending ? (
                <i className="ri-loader-4-line animate-spin text-lg"></i>
              ) : (
                <i className="ri-send-plane-fill text-lg mt-1"></i>
              )}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationArea;
