import { useState, useEffect } from "react";
import {
  Bell,
  Check,
  Trash2,
  Mail,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar,
  Settings,
  MoreVertical,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { notificationApi } from "@services/notificationApi";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { ErrorDisplay } from "@components/ErrorDisplay";
import { formatVNDate } from "@configs/formatVNDate";
function Notification() {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const { userId } = useAuth();
  const [showMenu, setShowMenu] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(notifications);
  const fetchNotification = async () => {
    try {
      setLoading(true);
      const response = await notificationApi.getAllNotificationByUserId(userId);
      if (response.code === 2000) {
        setNotifications(response.data);
      } else {
        setError("Failed to fetch notification");
      }
    } catch (err) {
      setError("Error fetching notification: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchNotification();
  }, [userId]);

  const statusMap = {
    SUCCESS: {
      icon: CheckCircle,
      color: {
        bg: "bg-green-400/10",
        text: "text-green-400",
        border: "border-green-400/20",
      },
    },
    ERROR: {
      icon: XCircle,
      color: {
        bg: "bg-red-400/10",
        text: "text-red-400",
        border: "border-red-400/20",
      },
    },
    INFO: {
      icon: AlertCircle,
      color: {
        bg: "bg-blue-400/10",
        text: "text-blue-400",
        border: "border-blue-400/20",
      },
    },
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.isRead(id); // gọi API đánh dấu read
      setNotifications(
        notifications.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error(error);
      alert("Đánh dấu đã đọc thất bại");
    } finally {
      setShowMenu(null);
    }
  };
  const handleReadAll = async () => {
    try {
      await notificationApi.isReadAll(userId);
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error(error);
      alert("Đánh dấu đã đọc thất bại");
    }
  };
  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc muốn xóa thông báo này?")) {
      try {
        await notificationApi.deleteById(id);
        setNotifications(notifications.filter((notif) => notif.id !== id));
      } catch (error) {
        console.error(error);
        alert("Xóa thông báo thất bại");
      } finally {
        setShowMenu(null);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (confirm("Bạn có chắc muốn xóa tất cả thông báo?")) {
      try {
        await notificationApi.deleteAll(userId);
        setNotifications([]);
      } catch (error) {
        console.error(error);
        alert("Xóa tất cả thông báo thất bại");
      }
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "0") return !notif.isRead;
    if (filter === "1") return notif.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return <LoadingSpinner message="Đang tải gói dịch vụ..." />;
  }

  if (error) {
    return (
      <ErrorDisplay message={error} onRetry={() => window.location.reload()} />
    );
  }
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Bell size={32} />
              Thông báo
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-sm px-2.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-gray-400">Quản lý thông báo và cập nhật</p>
          </div>
          <button
            onClick={handleReadAll}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
          >
            <Check size={18} />
            Đánh dấu đã đọc tất cả
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="text-blue-400" size={20} />
              <span className="text-sm text-gray-400">Tổng thông báo</span>
            </div>
            <p className="text-2xl font-bold">{notifications.length}</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="text-yellow-400" size={20} />
              <span className="text-sm text-gray-400">Chưa đọc</span>
            </div>
            <p className="text-2xl font-bold text-yellow-400">{unreadCount}</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="text-green-400" size={20} />
              <span className="text-sm text-gray-400">Đã đọc</span>
            </div>
            <p className="text-2xl font-bold text-green-400">
              {notifications.length - unreadCount}
            </p>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === "all"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilter("0")}
                className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                  filter === "0"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Chưa đọc
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setFilter("1")}
                className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                  filter === "1"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Đã đọc
                <span className="bg-gray-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {notifications?.length - unreadCount}
                </span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleDeleteAll}
                disabled={notifications.length === 0}
                className="px-4 py-2 text-red-400 hover:bg-red-400/10 disabled:text-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 size={18} />
                Xóa tất cả
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.map((notif) => {
            const { icon: Icon, color } = statusMap[notif.status] || {};
            return (
              <div
                key={notif.id}
                className={`bg-gray-900 border rounded-xl p-5 hover:border-gray-700 transition-all ${
                  notif.isRead
                    ? "border-gray-800 opacity-60"
                    : "border-gray-700"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={` p-3 rounded-lg flex-shrink-0`}>
                    {Icon && <Icon className={color?.text} size={24} />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{notif.title}</h3>
                      <div className="flex items-center gap-2">
                        {!notif.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowMenu(
                                showMenu === notif.id ? null : notif.id
                              )
                            }
                            className="p-1 hover:bg-gray-800 rounded transition-colors"
                          >
                            <MoreVertical size={18} className="text-gray-400" />
                          </button>

                          {/* Dropdown Menu */}
                          {showMenu === notif.id && (
                            <div className="absolute right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 min-w-[160px]">
                              {!notif.isRead ? (
                                <button
                                  onClick={() => handleMarkAsRead(notif.id)}
                                  className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
                                >
                                  <Check size={16} />
                                  Đánh dấu đã đọc
                                </button>
                              ) : (
                                <button className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm">
                                  <Mail size={16} />
                                  Đánh dấu chưa đọc
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(notif.id)}
                                className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm text-red-400"
                              >
                                <Trash2 size={16} />
                                Xóa
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-3">
                      {notif.message}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={14} />
                      <span>{formatVNDate(notif.created)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <Bell className="mx-auto mb-4 text-gray-600" size={48} />
            <p className="text-gray-400 mb-2">Không có thông báo nào</p>
            <p className="text-sm text-gray-500">
              {filter === "unread"
                ? "Bạn đã đọc tất cả thông báo"
                : filter === "read"
                ? "Chưa có thông báo nào được đọc"
                : "Chưa có thông báo nào"}
            </p>
          </div>
        )}

        {/* Settings Link */}
        <div className="mt-6 text-center">
          <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 mx-auto">
            <Settings size={16} />
            Cài đặt thông báo
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notification;
