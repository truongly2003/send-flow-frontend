import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Package as PackageIcon,
  Mail,
  Users,
  Target,
  FileText,
  UserPlus,
} from "lucide-react";
import { planApi } from "@services/planApi";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { ErrorDisplay } from "@components/ErrorDisplay";

function Package() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    currency: "VND",
    maxContacts: "",
    maxEmailsPerMonth: "",
    maxCampaignsPerMonth: "",
    maxTemplates: "",
    allowSmtpCustom: false,
    allowTeamMembers: "",
    status: "ACTIVE",
    period: "MONTHLY",
  });

  // Fetch packages from API
  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await planApi.getAllPlan();
      if (response.code === 2000) {
        setPackages(response.data);
      } else {
        setError(response.message || "Không thể tải danh sách gói");
      }
    } catch (err) {
      setError(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      currency: "VND",
      maxContacts: "",
      maxEmailsPerMonth: "",
      maxCampaignsPerMonth: "",
      maxTemplates: "",
      allowSmtpCustom: false,
      allowTeamMembers: "",
      status: "ACTIVE",
      period: "MONTHLY",
    });
  };

  // Handle input change
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Open create modal
  const openCreateModal = () => {
    resetForm();
    setModalMode("create");
    setSelectedPackage(null);
    setShowModal(true);
  };

  // Open edit modal
  const openEditModal = (pkg) => {
    setFormData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      currency: pkg.currency,
      maxContacts: pkg.maxContacts,
      maxEmailsPerMonth: pkg.maxEmailsPerMonth,
      maxCampaignsPerMonth: pkg.maxCampaignsPerMonth,
      maxTemplates: pkg.maxTemplates,
      allowSmtpCustom: pkg.allowSmtpCustom,
      allowTeamMembers: pkg.allowTeamMembers,
      status: pkg.status,
      period: pkg.period,
    });
    setModalMode("edit");
    setSelectedPackage(pkg);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    resetForm();
    setSelectedPackage(null);
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.price ||
      !formData.maxContacts ||
      !formData.maxEmailsPerMonth ||
      !formData.maxCampaignsPerMonth ||
      !formData.maxTemplates ||
      !formData.allowTeamMembers
    ) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return false;
    }
    return true;
  };

  // Handle submit (create or update)
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        currency: formData.currency,
        maxContacts: parseInt(formData.maxContacts),
        maxEmailsPerMonth: parseInt(formData.maxEmailsPerMonth),
        maxCampaignsPerMonth: parseInt(formData.maxCampaignsPerMonth),
        maxTemplates: parseInt(formData.maxTemplates),
        allowSmtpCustom: formData.allowSmtpCustom,
        allowTeamMembers: parseInt(formData.allowTeamMembers),
        status: formData.status,
        period: formData.period,
      };

      let response;
      if (modalMode === "create") {
        response = await planApi.createPlan(payload);
      } else {
        response = await planApi.updatePlan(selectedPackage.id, payload);
      }

      if (response.code === 2000) {
        alert(
          modalMode === "create"
            ? "Tạo gói thành công!"
            : "Cập nhật gói thành công!"
        );
        closeModal();
        fetchPackages();
      } else {
        alert("Lỗi: " + (response.message || "Không thể lưu"));
      }
    } catch (err) {
      alert("Lỗi: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (pkg) => {
    if (!confirm(`Bạn có chắc muốn xóa gói "${pkg.name}"?`)) return;

    try {
      const response = await planApi.deletePlan(pkg.id);
      if (response.code === 2000) {
        alert("Xóa gói thành công!");
        fetchPackages();
      } else {
        alert("Lỗi: " + (response.message || "Không thể xóa"));
      }
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  // Format value for display
  const formatValue = (value) => {
    if (value === -1 || value === 999999) return "Unlimited";
    return value.toLocaleString();
  };

  // Get period text
  const getPeriodText = (period) => {
    const map = {
      MONTHLY: "tháng",
      YEARLY: "năm",

      LIFETIME: "trọn đời",
    };
    return map[period] || period;
  };

  if (loading) {
    return <LoadingSpinner message="Đang tải danh sách gói dịch vụ..." />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={fetchPackages} />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quản lý gói dịch vụ</h1>
            <p className="text-gray-400">
              Tạo và quản lý các gói dịch vụ email marketing
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium"
          >
            <Plus size={20} />
            Tạo gói mới
          </button>
        </div>

        {/* Empty state */}
        {packages.length === 0 && (
          <div className="text-center py-16">
            <PackageIcon className="mx-auto text-gray-600 mb-4" size={64} />
            <p className="text-gray-400 text-lg mb-4">
              Chưa có gói dịch vụ nào
            </p>
            <button
              onClick={openCreateModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Tạo gói đầu tiên
            </button>
          </div>
        )}

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all hover:shadow-xl"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 border-b border-gray-800">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {pkg.name}
                    </h3>
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        pkg.status === "ACTIVE"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          pkg.status === "ACTIVE"
                            ? "bg-green-400"
                            : "bg-gray-400"
                        }`}
                      ></div>
                      {pkg.status}
                    </div>
                  </div>
                  <PackageIcon className="text-blue-400" size={28} />
                </div>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {pkg.description}
                </p>
              </div>

              {/* Pricing */}
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-blue-400">
                    {pkg.price.toLocaleString()}
                  </span>
                  <span className="text-gray-400 text-sm">{pkg.currency}</span>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Per {getPeriodText(pkg.period)}
                </p>
              </div>

              {/* Features */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail size={16} />
                    <span>Emails/tháng</span>
                  </div>
                  <span className="font-semibold text-white">
                    {formatValue(pkg.maxEmailsPerMonth)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Target size={16} />
                    <span>Chiến dịch/tháng</span>
                  </div>
                  <span className="font-semibold text-white">
                    {formatValue(pkg.maxCampaignsPerMonth)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users size={16} />
                    <span>Liên hệ</span>
                  </div>
                  <span className="font-semibold text-white">
                    {formatValue(pkg.maxContacts)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <FileText size={16} />
                    <span>Templates</span>
                  </div>
                  <span className="font-semibold text-white">
                    {formatValue(pkg.maxTemplates)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <UserPlus size={16} />
                    <span>Thành viên</span>
                  </div>
                  <span className="font-semibold text-white">
                    {formatValue(pkg.allowTeamMembers)}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-800">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        pkg.allowSmtpCustom ? "bg-green-400" : "bg-gray-600"
                      }`}
                    ></div>
                    <span
                      className={`text-sm ${
                        pkg.allowSmtpCustom ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      SMTP tùy chỉnh
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 pt-0 flex gap-2">
                <button
                  onClick={() => openEditModal(pkg)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium"
                >
                  <Edit size={16} />
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(pkg)}
                  className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium border border-red-600/30"
                >
                  <Trash2 size={16} />
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-800">
                <h2 className="text-2xl font-bold text-white">
                  {modalMode === "create"
                    ? "Tạo gói mới"
                    : `Chỉnh sửa: ${selectedPackage?.name}`}
                </h2>
                <button
                  onClick={closeModal}
                  disabled={submitting}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Basic Info */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Thông tin cơ bản
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-gray-400 text-sm block mb-2">
                        Tên gói *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="VD: Premium Plan"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-gray-400 text-sm block mb-2">
                        Mô tả
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          handleChange("description", e.target.value)
                        }
                        className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
                        rows="3"
                        placeholder="Mô tả ngắn về gói dịch vụ..."
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm block mb-2">
                        Giá *
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleChange("price", e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="299000"
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm block mb-2">
                        Đơn vị tiền tệ
                      </label>
                      <select
                        value={formData.currency}
                        onChange={(e) =>
                          handleChange("currency", e.target.value)
                        }
                        className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        <option value="VND">VND</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm block mb-2">
                        Chu kỳ
                      </label>
                      <select
                        value={formData.period}
                        onChange={(e) => handleChange("period", e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        <option value="MONTHLY">Hàng tháng</option>

                        <option value="YEARLY">Hàng năm</option>
                        <option value="LIFETIME">Trọn đời</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm block mb-2">
                        Trạng thái
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleChange("status", e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Limits */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Giới hạn sử dụng
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm block mb-2">
                        Số email/tháng *
                      </label>
                      <input
                        type="number"
                        value={formData.maxEmailsPerMonth}
                        onChange={(e) =>
                          handleChange("maxEmailsPerMonth", e.target.value)
                        }
                        className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="10000"
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm block mb-2">
                        Chiến dịch/tháng *
                      </label>
                      <input
                        type="number"
                        value={formData.maxCampaignsPerMonth}
                        onChange={(e) =>
                          handleChange("maxCampaignsPerMonth", e.target.value)
                        }
                        className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="50"
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm block mb-2">
                        Số liên hệ *
                      </label>
                      <input
                        type="number"
                        value={formData.maxContacts}
                        onChange={(e) =>
                          handleChange("maxContacts", e.target.value)
                        }
                        className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="5000"
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm block mb-2">
                        Số templates *
                      </label>
                      <input
                        type="number"
                        value={formData.maxTemplates}
                        onChange={(e) =>
                          handleChange("maxTemplates", e.target.value)
                        }
                        className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="20"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-gray-400 text-sm block mb-2">
                        Số thành viên *
                      </label>
                      <input
                        type="number"
                        value={formData.allowTeamMembers}
                        onChange={(e) =>
                          handleChange("allowTeamMembers", e.target.value)
                        }
                        className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="5"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Features */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Tính năng bổ sung
                  </h3>
                  <label className="flex items-center gap-3 cursor-pointer bg-gray-800 p-4 rounded-lg hover:bg-gray-800/80 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.allowSmtpCustom}
                      onChange={(e) =>
                        handleChange("allowSmtpCustom", e.target.checked)
                      }
                      className="w-5 h-5 rounded accent-blue-600"
                    />
                    <div>
                      <span className="text-white font-medium">
                        Cho phép SMTP tùy chỉnh
                      </span>
                      <p className="text-gray-400 text-sm">
                        Người dùng có thể cấu hình SMTP server riêng
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 p-6 border-t border-gray-800">
                <button
                  onClick={closeModal}
                  disabled={submitting}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      {modalMode === "create" ? "Tạo gói" : "Cập nhật"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Package;
