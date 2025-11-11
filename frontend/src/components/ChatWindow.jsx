import React, { useState, useRef, useEffect, useContext } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { motion, AnimatePresence } from "framer-motion";
import bookIcon from "../assets/bookicon.png";
import slideIcon from "../assets/slideicon.png";
import pyqIcon from "../assets/pyqicon.png";
import ctIcon from "../assets/cticon.png";
import gearIcon from "../assets/gearicon.png";
import { ChatContext } from "../context/ChatContext.jsx";

export default function ChatWindow() {
  const { aiReplyMessage } = useContext(ChatContext);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Welcome to Raf-Genie! Quickly find links to previous year questions, lecture slides, PDFs, and class notes for RUET CSE 23.",
    },
  ]);

  const [showTools, setShowTools] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null); // 'classnotes' | 'slides' | 'ct' | 'semester' | null
  const scrollRef = useRef(null);
  const lastAiRef = useRef("");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // append ai reply once
  useEffect(() => {
    if (aiReplyMessage && aiReplyMessage !== lastAiRef.current) {
      setMessages((m) => [...m, { sender: "ai", text: aiReplyMessage }]);
      lastAiRef.current = aiReplyMessage;
    }
  }, [aiReplyMessage]);

  const toggleOption = (opt) => {
    setSelectedOption((prev) => (prev === opt ? null : opt));
  };

  const handleSend = (text) => {
    setMessages((m) => [...m, { sender: "user", text }]);
    // ChatInput will call context.sendMessage(text, selectedOption)
  };

  // helper to compute active classes
  const activeClass = (opt) =>
    selectedOption === opt
      ? "bg-[#063446] ring-2 ring-[#00aaff] text-white"
      : "bg-[#11161f] hover:bg-[#1a2230]";

  const optionMeta = {
    classnotes: { label: "Class Notes", icon: bookIcon },
    slides: { label: "Lecture Slides", icon: slideIcon },
    ct: { label: "CT Questions", icon: ctIcon },
    semester: { label: "Semester Questions", icon: pyqIcon },
  };

  return (
    <div className="w-full max-w-4xl h-[90vh] flex flex-col items-center px-4 sm:px-6 overflow-visible sm:overflow-hidden relative">
      {/* Scrollable messages area */}
      <div
        ref={scrollRef}
        className="flex-1 w-full overflow-y-auto bg-transparent rounded-xl scrollbar-dark"
      >
        <div className="p-4">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
        </div>
      </div>

      {/* Chat input */}
      <div className="w-full relative">
        {/* Selected option pill — visible only on mobile & tablet when tools popup is open */}
        { selectedOption && optionMeta[selectedOption] && (
          <div className="block sm:hidden absolute right-[4.6rem] bottom-[5.3rem] z-40">
            <div className="inline-flex items-center gap-2 bg-[#063446] text-white px-3 py-2 rounded-full ring-1 ring-[#00aaff] shadow-lg select-none">
              <img
                src={optionMeta[selectedOption].icon}
                alt={optionMeta[selectedOption].label}
                className="w-5 h-5"
              />
              <span className="text-xs font-medium">
                {optionMeta[selectedOption].label}
              </span>
            </div>
          </div>
        )}



        {/* pass selectedOption down so ChatInput can include it when sending */}
        <ChatInput onSend={handleSend} selectedOption={selectedOption} />

        {/* Desktop tools - single selectable (like radio) */}
        <div className="hidden sm:flex mt-4 mb-2 flex-wrap justify-center gap-3 text-gray-400 text-sm">
          <button
            onClick={() => toggleOption("classnotes")}
            className={`px-4 py-2 rounded-full flex items-center transition ${activeClass(
              "classnotes"
            )}`}
          >
            <img src={bookIcon} alt="Book" className="w-5 h-5 mr-2" />
            Class Notes
          </button>

          <button
            onClick={() => toggleOption("slides")}
            className={`px-4 py-2 rounded-full flex items-center transition ${activeClass(
              "slides"
            )}`}
          >
            <img src={slideIcon} alt="Slide" className="w-5 h-5 mr-2" />
            Lecture Slides
          </button>

          <button
            onClick={() => toggleOption("ct")}
            className={`px-4 py-2 rounded-full flex items-center transition ${activeClass(
              "ct"
            )}`}
          >
            <img src={ctIcon} alt="CT" className="w-5 h-5 mr-2" />
            CT Questions
          </button>

          <button
            onClick={() => toggleOption("semester")}
            className={`px-4 py-2 rounded-full flex items-center transition ${activeClass(
              "semester"
            )}`}
          >
            <img src={pyqIcon} alt="SEM" className="w-5 h-5 mr-2" />
            Semester Questions
          </button>
        </div>

        {/* Mobile floating tool button */}
        <div className="sm:hidden absolute right-6 bottom-20 z-50">
          <button
            onClick={() => setShowTools(!showTools)}
            className="bg-[#1a2230] p-3 rounded-full shadow-lg hover:bg-[#222b3c] transition"
            aria-label="Tools"
          >
            <img src={gearIcon} alt="gearIcon" className="w-5 h-5" />
          </button>

          {/* Animated popup menu */}
          <AnimatePresence>
            {showTools && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="absolute bottom-14 right-0 bg-[#0e141d] border border-[#1b2533] rounded-2xl shadow-2xl p-3 w-48 flex flex-col gap-3 z-50"
              >
                <button
                  onClick={() => {
                    toggleOption("classnotes");
                    setShowTools(false);
                  }}
                  className={`py-2 rounded-lg text-gray-300 flex items-center pl-2 gap-2 ${selectedOption === "classnotes"
                    ? "bg-[#063446] ring-1 ring-[#00aaff]"
                    : "bg-[#11161f]"
                    }`}
                >
                  <img src={bookIcon} alt="Book" className="w-5 h-5" />
                  Book Search
                </button>

                <button
                  onClick={() => {
                    toggleOption("slides");
                    setShowTools(false);
                  }}
                  className={`py-2 rounded-lg text-gray-300 flex items-center pl-2 gap-2 ${selectedOption === "slides"
                    ? "bg-[#063446] ring-1 ring-[#00aaff]"
                    : "bg-[#11161f]"
                    }`}
                >
                  <img src={slideIcon} alt="Slide" className="w-5 h-5" />
                  Slide Search
                </button>

                <button
                  onClick={() => {
                    toggleOption("ct");
                    setShowTools(false);
                  }}
                  className={`py-2 rounded-lg text-gray-300 flex items-center pl-2 gap-2 ${selectedOption === "ct"
                    ? "bg-[#063446] ring-1 ring-[#00aaff]"
                    : "bg-[#11161f]"
                    }`}
                >
                  <img src={ctIcon} alt="CT" className="w-5 h-5" />
                  CT Questions
                </button>

                <button
                  onClick={() => {
                    toggleOption("semester");
                    setShowTools(false);
                  }}
                  className={`py-2 rounded-lg text-gray-300 flex items-center pl-2 gap-2 ${selectedOption === "semester"
                    ? "bg-[#063446] ring-1 ring-[#00aaff]"
                    : "bg-[#11161f]"
                    }`}
                >
                  <img src={pyqIcon} alt="SEM" className="w-5 h-5" />
                  Sem Questions
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
