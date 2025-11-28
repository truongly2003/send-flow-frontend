import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import { Menu } from "lucide-react";

function DefaultLayout() {
  // Check if device is mobile on initial load
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto close sidebar on mobile, auto open on desktop
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Sidebar 
   
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div
        className={`min-h-screen flex flex-col transition-all duration-300 ${
          isSidebarOpen && !isMobile ? "md:ml-80" : "ml-0"
        }`}
      >
        {/* Mobile Header with Menu Button */}
        {isMobile && (
          <div className="sticky top-0 z-40 bg-gray-900 border-b border-gray-800 p-4">
            <button
              onClick={toggleSidebar}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <Menu size={24} className="text-white" />
            </button>
          </div>
        )}

        <main className="flex-1 p-4 md:p-6" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DefaultLayout;