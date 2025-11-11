import React from "react";

export default function ChatMessage({ message }) {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex w-full my-2 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] p-3 rounded-2xl ${
          isUser
            ? "bg-[#1e2633] text-white rounded-br-none"
            : "bg-[#11161f] text-gray-200 rounded-bl-none"
        }`}
      >
        <p className="whitespace-pre-wrap text-sm sm:text-base">
          {message.text}
        </p>
      </div>
    </div>
  );
}
