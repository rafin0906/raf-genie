import React, { createContext, useState, useCallback } from "react";
import axios from "axios";

export const ChatContext = createContext(null);

export function ChatProvider({ children }) {
    const [userSentMessage, setUserSentMessage] = useState("");
    const [aiReplyMessage, setAiReplyMessage] = useState("");

    // now accepts selectedOption and sends it to backend
    const sendMessage = useCallback(async (message, selectedOption = "none") => {
        setUserSentMessage(message);
        console.log(selectedOption)
        try {
            const res = await axios.post("/api/v1/chat", { message, selectedOption });
            const reply = res?.data?.data ?? "";
            setAiReplyMessage(reply);
        } catch (err) {
            setAiReplyMessage("Sorry, something went wrong.");
            console.error("chat send error:", err);
        }
    }, []);

    return (
        <ChatContext.Provider
            value={{
                userSentMessage,
                aiReplyMessage,
                setUserSentMessage,
                setAiReplyMessage,
                sendMessage,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}