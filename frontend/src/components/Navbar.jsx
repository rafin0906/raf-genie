import React from "react";
import logo from "../assets/logo.png";

export default function Navbar() {
    return (
        <div className="w-full flex items-center py-3 bg-[#0a0d12] px-4 sm:px-6 lg:pl-16">
            <div className="flex items-center space-x-3">
                <img src={logo} alt="Raf-Genie Logo" className="w-8 h-8" />
                <h1 className="text-xl font-semibold text-white">Raf–Genie</h1>
            </div>
        </div>
    );
}
