import { useState, useEffect } from "react";
import { Search, Eye, Trash2, Users } from "lucide-react";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { ErrorDisplay } from "@components/ErrorDisplay";
import { userApi } from "@services/userApi";
import { formatVNDate } from "@configs/formatVNDate";
function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [showDetailUser, setShowDetailUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userApi.getAllUser();
      if (response.code === 2000) {
        setUsers(response.data);
      } else {
        setError(response.message || "Không thể tải danh sách người dùng");
      }
    } catch (err) {
      setError(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleDetail = (user) => {
    setSelectedUser(user);
    setShowDetailUser(true);
  };

  const handleDelete = (user) => {
    if (confirm(`Bạn có chắc muốn xóa user "${user.email}"?`)) {
      setUsers(users.filter((u) => u.id !== user.id));
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesSearch =
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });
  if (loading) {
    return <LoadingSpinner message="Đang tải danh sách gói dịch vụ..." />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={fetchUser} />;
  }
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-gray-400">Xem, xóa người dùng</p>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Tìm kiếm user theo email hoặc tên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setFilterRole("all")}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filterRole === "all"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Tất cả
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Subscription
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Stats
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Last Login
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">{user.role}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white">
                          {user.subscription}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            user.subscriptionStatus === "active"
                              ? "bg-green-400/10 text-green-400"
                              : "bg-red-400/10 text-red-400"
                          }`}
                        >
                          {user.subscriptionStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-400">
                          {user.totalCampaign} campaigns
                        </p>
                        <p className="text-gray-400">
                          {user.totalEmailSend
                            ? user.totalEmailSend.toLocaleString()
                            : 0}{" "}
                          emails
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-400">{formatVNDate(user.lastLogin)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDetail(user)}
                          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-blue-400"
                          title="Edit"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-red-400"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center mt-6">
            <Users className="mx-auto mb-4 text-gray-600" size={48} />
            <p className="text-gray-400">Không tìm thấy user nào</p>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailUser && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">User Detail</h2>
                <button
                  onClick={() => setShowDetailUser(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Name
                  </label>
                  <p className="text-white">{selectedUser.name}</p>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Email
                  </label>
                  <p className="text-white">{selectedUser.email}</p>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Phone
                  </label>
                  <p className="text-white">{selectedUser.phone || "N/A"}</p>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Address
                  </label>
                  <p className="text-white">{selectedUser.address || "N/A"}</p>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Role
                  </label>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedUser.role === "admin"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {selectedUser.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default User;
