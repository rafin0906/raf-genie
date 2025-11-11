import React, { useState, useContext } from "react";
import { IoSend } from "react-icons/io5";
import { BsMic } from "react-icons/bs";
import { ChatContext } from "../context/ChatContext.jsx";

export default function ChatInput({ onSend, selectedOption = null }) {
    const [input, setInput] = useState("");
    const { sendMessage } = useContext(ChatContext);

    const handleSend = async () => {
        if (input.trim()) {
            const text = input.trim();
            // append locally (ChatWindow still maintains local list)
            onSend?.(text);
            // send to backend with selected option (or "none")
            await sendMessage(text, selectedOption ?? "none");
            setInput("");
        }
    };

    return (
        <div className="w-full mb-4 flex items-center bg-[#0d1117] border border-gray-700 rounded-2xl px-4 py-3 shadow-[0_0_6px_1px_rgba(0,170,255,0.25)] hover:shadow-[0_0_8px_2px_rgba(0,170,255,0.4)] transition-shadow duration-300">
            <input
                type="text"
                className="flex-1 bg-transparent outline-none text-sm sm:text-base placeholder-gray-400"
                placeholder="Ask Me Anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <div className="flex items-center space-x-3">
                {/* <button className="text-gray-400 hover:text-white">
                    <BsMic size={18} />
                </button> */}
                <button onClick={handleSend} className="text-black bg-[#00aaff] hover:bg-[#0091d9] p-2 rounded-full">
                    <IoSend size={18} />
                </button>
            </div>
        </div>
    );
}
