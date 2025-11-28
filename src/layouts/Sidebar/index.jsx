import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Send,
  Users,
  FileText,
  Package,
  LogOut,
  X,
  Settings,
  Shield,
  UserCog,
  User,
  Bell,
  Settings2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Sidebar Component
function Sidebar({  isOpen = false, onClose }) {
  const [activeItem, setActiveItem] = useState("Thống kê");
  const navigate = useNavigate();
  const {user,logout} = useAuth();
  const role = user?.role?.toLowerCase();
  useEffect(()=>{
    setActiveItem(location.pathname)
  },[location.pathname])
  // Menu items cho người dùng
  const userMenuItems = [
    { icon: Home, label: "Thống kê", to: "/dashboard" },
    { icon: Send, label: "Chiến dịch", to: "/campaign" },
    { icon: Users, label: "Liên hệ", to: "/contact-list" },
    { icon: FileText, label: "Mẫu tin", to: "/template" },
    { icon: Package, label: "Gói dịch vụ", to: "/plan" },
    { icon: Bell, label: "Thông báo (2)", to: "/notification" },
    { icon: Settings2, label: "Cài đặt", to: "/setting" },
  ];

  // Menu items cho quản trị viên
  const adminMenuItems = [
    { icon: Home, label: "Thống kê", to: "/admin/dashboard/" },
    { icon: UserCog, label: "Người dùng", to: "/admin/user" },
    { icon: Package, label: "Gói dịch vụ", to: "/admin/package" },
    { icon: Shield, label: "Giao dịch", to: "/admin/transaction" },
    { icon: Settings, label: "Giám sát", to: "/admin/sendlog" },
    { icon: Bell, label: "Thông báo (2)", to: "/notification" },
  ];

  const menuItems = role === "admin" ? adminMenuItems : userMenuItems;

  const handleItemClick = (item) => {
    setActiveItem(item.label);
    navigate(item.to);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed left-0 top-0 h-full w-80 bg-black text-white transition-transform duration-300 ease-in-out z-50 flex flex-col ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">
          {role === "admin" ? "Admin Panel" : "Send Flow"}
        </h1>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-800 rounded transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.label;

          return (
            <button
              key={item.label}
              onClick={() => handleItemClick(item)}
              className={`w-full flex items-center gap-4 px-6 py-3 transition-colors ${
                isActive
                  ? "bg-gray-800 border-l-4 border-blue-500"
                  : "hover:bg-gray-800 border-l-4 border-transparent"
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer - Logout */}
      <div className=" border-gray-700">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-700">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
            <User size={20} className="text-gray-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">Email: {user.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-800 transition-colors text-red-400"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
export default Sidebar;
Sidebar.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};
