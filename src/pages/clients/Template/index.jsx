import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Mail,
  MessageSquare,
  FileText,
  X,
  Save,
  Eye,
} from "lucide-react";
import { templateApi } from "@services/templateApi";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { ErrorDisplay } from "@components/ErrorDisplay";
import { formatVNDate } from "@configs/formatVNDate";
import { useAuth } from "@/contexts/AuthContext";

import { useNavigate } from "react-router-dom";

function Template() {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await templateApi.getAllTemplate(userId);
      if (response.code === 2000) {
        setTemplates(response.data);
      } else {
        setError("Failed to fetch template");
      }
    } catch (err) {
      setError("Error fetching template: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTemplates();
  }, [userId]);

  const [formData, setFormData] = useState({
    userId: userId,
    name: "",
    subject: "",
    body: "",
    type: "HTML",
    category: "EMAIL",
  });
  const handleChangeTemplate = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSaveTemplate = async () => {
    try {
      if (!formData.name || !formData.subject) {
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
      }
      let response;
      if (formData.id) {
        console.log(formData.id);
        response = await templateApi.updateTemplate(formData.id, formData);
      } else {
        response = await templateApi.createTemplate(formData);
      }
      if (response.code === 2000) {
        alert(response.message);
        await fetchTemplates();
      }
      setModalOpen(false);
      setFormData({
        userId: userId,
        name: "",
        subject: "",
        body: "",
        type: "HTML",
        category: "EMAIL",
      });
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi lưu template");
    }
  };

  const handleClone = async (template) => {
    try {
      const clonedTemplate = {
        userId: userId,
        name: `${template.name} (Copy)`,
        subject: template.subject,
        body: template.body,
        type: template.type,
        category: template.category,
      };
      const response = await templateApi.createTemplate(clonedTemplate);

      if (response.code === 2000) {
        alert("Đã nhân bản template thành công!");
        await fetchTemplates();
      } else {
        alert("Không thể nhân bản template!");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi nhân bản template: " + err.message);
    }
  };

  const handleEdit = (template) => {
    setFormData({
      id: template.id,
      userId: template.userId,
      name: template.name,
      subject: template.subject,
      body: template.body,
      type: template.type,
      category: template.category,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc muốn xóa template này?")) {
      try {
        const response = await templateApi.deleteTemplate(id);
        if (response.code === 2000) {
          alert(response.message);
          setTemplates(templates.filter((temp) => temp.id !== id));
        } else {
          setError("Failed to delete list");
        }
      } catch (err) {
        setError("Error deleting list: " + err.message);
      }
    }
  };
  const handleViewTemplateDetail = (template) => {
    navigate(`/template/${template.id}`, { state: { template } });
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return <LoadingSpinner message="Đang tải gói dịch vụ..." />;
  }

  if (error) {
    return (
      <ErrorDisplay message={error} onRetry={() => window.location.reload()} />
    );
  }
  // Template List
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Templates</h1>
            <p className="text-gray-400">Quản lý template email và Zalo</p>
          </div>
          <button
            onClick={() => {
              setFormData({
                userId,
                name: "",
                subject: "",
                body: "",
                type: "HTML",
                category: "EMAIL",
              });
              setModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Tạo template mới
          </button>
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
                placeholder="Tìm kiếm template..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${"bg-blue-500/10"}`}>
                    {template.category === "EMAIL" ? (
                      <Mail className="text-blue-400" size={20} />
                    ) : (
                      <MessageSquare className="text-green-400" size={20} />
                    )}
                  </div>
                  <div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        template.category === "EMAIL"
                          ? "bg-blue-400/10 text-blue-400"
                          : "bg-green-400/10 text-green-400"
                      }`}
                    >
                      {template.category === "EMAIL" ? "Email" : "Zalo"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
              <p className="text-sm text-gray-400 mb-1 line-clamp-1">
                {template.subject}
              </p>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                {template.body}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 pt-4 border-t border-gray-800">
                <span>Sử dụng: {template.usageCount} lần</span>
                <span>•</span>
                <span>{formatVNDate(template.createdAt)}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleViewTemplateDetail(template)}
                  className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Eye size={16} />
                  Xem
                </button>
                <button
                  onClick={() => handleEdit(template)}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Edit size={16} />
                  Sửa
                </button>
                <button
                  onClick={() => handleClone(template)}
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Clone"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={() => handleDelete(template.id)}
                  className="p-2 text-red-400 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Xóa"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <FileText className="mx-auto mb-4 text-gray-600" size={48} />
            <p className="text-gray-400">Không tìm thấy template nào</p>
          </div>
        )}
      </div>

      {/* modal create and update */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {formData.id ? "Cập nhật template" : "Tạo template mới"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-full"
              >
                <X />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Tên template</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChangeTemplate}
                  className="w-full mt-1 px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Tiêu đề</label>
                <input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChangeTemplate}
                  className="w-full mt-1 px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Nội dung</label>
                <textarea
                  name="body"
                  rows={6}
                  value={formData.body}
                  onChange={handleChangeTemplate}
                  className="w-full mt-1 px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveTemplate}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2"
              >
                <Save size={16} /> Lưu
              </button>
            </div>
          </div>
        </div>
      )}
      {/* modal create and update */}
    </div>
  );
}

export default Template;
