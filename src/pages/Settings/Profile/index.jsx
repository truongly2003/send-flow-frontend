import { useEffect, useState } from "react";
import { userApi } from "@/services/userApi";
import { useAuth } from "@/contexts/AuthContext";

function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    createdAt: "",
  });

  // Fetch user info
  const fetchUser = async () => {
    if (!user?.userId) return;

    try {
      const response = await userApi.getUserById(user.userId);

      setFormData({
        name: response.data.name || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
        company: response.data.company || "",
        address: response.data.address || "",
        createdAt: response.data.createdAt || "",
      });
    } catch (err) {
      console.log("Error fetching user: ", err.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [user?.userId]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit updates
  const handleSubmit = async () => {
    try {
      const response = await userApi.updateUser(user.userId, formData);
      console.log("Updated:", response.data);
      alert("Cập nhật thành công!");
    } catch (err) {
      console.log("Error updating user:", err.message);
    }
  };

  return (
    <div className="h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-100">
        Thông Tin Cá Nhân
      </h2>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Họ và tên</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-2">Số điện thoại</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-medium mb-2">Công ty</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Save button */}
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          Lưu Thay Đổi
        </button>
      </div>
    </div>
  );
}

export default Profile;
