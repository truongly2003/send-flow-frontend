import { useEffect, useState } from "react";
import { Plus, Trash2, Users, FolderOpen, Save, Edit } from "lucide-react";
import { contactListApi } from "@services/contactListApi";
import { useNavigate } from "react-router-dom";

import { LoadingSpinner } from "@components/LoadingSpinner";
import { ErrorDisplay } from "@components/ErrorDisplay";
import {useAuth} from "@/contexts/AuthContext"
function ContactList() {
  const [showModal, setShowModal] = useState(false);
  const {userId}=useAuth()
  const navigate = useNavigate();
  const [contactLists, setContactLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContactList = async () => {
    try {
      setLoading(true);
      const response = await contactListApi.getAllContactList(userId);

      if (response.code === 2000) {
        setContactLists(response.data);
      } else {
        setError("Failed to fetch plans");
      }
    } catch (err) {
      setError("Error fetching plans: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactList();
  }, [userId]);

  const [formData, setFormData] = useState({
    userId: userId,
    name: "",
    description: "",
  });

  const [editingList, setEditingList] = useState(null);

  const handleSaveList = async () => {
    try {
      let response;
      if (editingList) {
        // Update existing list
        response = await contactListApi.updateContactList(
          editingList.id,
          formData
        );
      } else {
        // Create new list
        response = await contactListApi.createContactList(formData);
      }
      if (response.code === 2000) {
        alert(response.message);
        fetchContactList();
      }
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteList = async (id) => {
    if (confirm("Bạn có chắc muốn xóa danh sách này?")) {
      try {
        const response = await contactListApi.deleteContactList(id);
        if (response.code === 2000) {
          alert(response.message);
          setContactLists(contactLists.filter((list) => list.id !== id));
        } else {
          setError("Failed to delete list");
        }
      } catch (err) {
        setError("Error deleting list: " + err.message);
      }
    }
  };

  const handleOpenModal = (list = null) => {
    if (list) {
      setEditingList(list);
      setFormData({
        userId: userId,
        name: list.name,
        description: list.description,
      });
    } else {
      setEditingList(null);
      setFormData({ name: "", description: "", userId: userId });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingList(null);
    setFormData({ name: "", description: "", userId: userId });
  };

  const handleViewListDetail = (list) => {
    navigate(`/contact-list/${list.id}`, { state: { list } });
  };

  if (loading) {
    return <LoadingSpinner message="Đang tải gói danh sách liên hệ..." />;
  }

  if (error) {
    return (
      <ErrorDisplay message={error} onRetry={() => window.location.reload()} />
    );
  }

  // Contact Lists View
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Danh sách liên hệ</h1>
            <p className="text-gray-400">Quản lý danh sách liên hệ của bạn</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Tạo danh sách mới
          </button>
        </div>

        {/* Lists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contactLists.map((list) => (
            <div
              key={list.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <FolderOpen className="text-blue-400" size={24} />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteList(list.id)}
                    className="p-2 text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-2">{list.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{list.description}</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users size={16} />
                  <span>{list.totalContacts} liên hệ</span>
                </div>
                <div className="flex space-x-2 justify-end content-center">
                  <button
                    onClick={() => handleOpenModal(list)}
                    className="p-2 text-blue-400 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleViewListDetail(list)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {contactLists.length === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <FolderOpen className="mx-auto mb-4 text-gray-600" size={48} />
            <p className="text-gray-400">Chưa có danh sách nào</p>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-2xl w-full">
              <h2 className="text-2xl font-bold mb-6">
                {editingList ? "Chỉnh sửa danh sách" : "Tạo danh sách mới"}
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tên danh sách
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSaveList}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    {editingList ? "Lưu thay đổi" : "Tạo danh sách"}
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactList;
