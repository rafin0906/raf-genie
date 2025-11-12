import React from "react";
import Navbar from "./components/Navbar";
import ChatWindow from "./components/ChatWindow";

export default function App() {
  return (
    <div
      className="min-h-screen bg-[#0a0d12] text-white flex flex-col items-center justify-start"
      style={{
        backgroundImage: `url('/bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar />
      <ChatWindow />
    </div>
  );
}
