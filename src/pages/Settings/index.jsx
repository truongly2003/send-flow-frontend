import { useState } from "react";

import Profile from "./Profile";
import SmtpConfig from "./SmtpConfig";
export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-gray-950  text-gray-200 p-8">
      <div className="max-w-7xl mx-auto bg-gray-900 border border-neutral-700 rounded-2xl shadow-xl">
        {/* Header - Tab Navigation */}
        <div className="flex border-b border-neutral-700">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative ${
              activeTab === "profile"
                ? "text-blue-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {/* <FiUser className="text-lg" /> */}
            Profile
            <div 
              className={`absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 transition-opacity duration-300 ${
                activeTab === "profile" ? "opacity-100" : "opacity-0"
              }`}
            />
          </button>

          <button
            onClick={() => setActiveTab("config")}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative ${
              activeTab === "config"
                ? "text-blue-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {/* <FiServer className="text-lg" /> */}
            SMTP Config
            <div 
              className={`absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 transition-opacity duration-300 ${
                activeTab === "config" ? "opacity-100" : "opacity-0"
              }`}
            />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-8">
          <div className="relative">
            <div
              className={`transition-opacity duration-200 ${
                activeTab === "profile" ? "opacity-100" : "opacity-0 pointer-events-none absolute inset-0"
              }`}
            >
              <Profile />
            </div>

            <div
              className={`transition-opacity duration-200 ${
                activeTab === "config" ? "opacity-100" : "opacity-0 pointer-events-none absolute inset-0"
              }`}
            >
              <SmtpConfig />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}