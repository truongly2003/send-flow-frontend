import { Mail, Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

// Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-5 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            <a href="#" className="hover:opacity-80 transition-opacity">
              <Mail className="inline-block mr-2 mb-1" size={28} />
              SendFlow
            </a>
          </h1>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-4">
            <NavLink to="/login">
              <button className="px-6 py-2 w-36 rounded-lg font-semibold transition-all duration-300 text-black bg-white hover:bg-gray-200">
                Đăng nhập
              </button>
            </NavLink>
            <NavLink to="/sign-up">
              <button className="px-6 py-2 w-36 rounded-lg font-semibold transition-all duration-300 text-black bg-white hover:bg-gray-200">
                Đăng ký
              </button>
            </NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="block md:hidden text-white p-2 hover:bg-gray-800 rounded transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Moved outside container */}
      {isMenuOpen && (
        <nav className="md:hidden absolute top-full right-0 bg-black border-b border-gray-800 shadow-lg">
          <div className="flex flex-col space-y-4 px-5 py-4">
            <NavLink to="/login" onClick={closeMenu}>
              <button className="w-36 px-6 py-2 rounded-lg font-semibold transition-all duration-300 text-black bg-white hover:bg-gray-200">
                Đăng nhập
              </button>
            </NavLink>
            <NavLink to="/sign-up" onClick={closeMenu}>
              <button className="w-36 px-6 py-2 rounded-lg font-semibold transition-all duration-300 text-black bg-white hover:bg-gray-200">
                Đăng ký
              </button>
            </NavLink>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;