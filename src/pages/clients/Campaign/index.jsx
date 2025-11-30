import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Mail,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Send,
  FileText,
  Trash2,
  Edit,
  X,
} from "lucide-react";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { ErrorDisplay } from "@components/ErrorDisplay";
import { campaignApi } from "@services/campaignApi";
import { templateApi } from "@services/templateApi";
import { contactListApi } from "@services/contactListApi";

import { formatVNDate } from "@configs/formatVNDate";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
function Campaign() {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [contactLists, setContactLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  // fet campaign
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await campaignApi.getAllCampaign(userId);
      if (response.code === 2000) {
        setCampaigns(response.data);
      } else {
        setError("Failed to fetch campaigns");
      }
    } catch (err) {
      setError("Error fetching campaigns: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  // fet templates
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await templateApi.getAllTemplate(userId);
      if (response.code === 2000) {
        setTemplates(response.data);
      } else {
        setError("Failed to fetch templates");
      }
    } catch (err) {
      setError("Error fetching templates: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  // fet contact-list
  const fetchContactLists = async () => {
    try {
      setLoading(true);
      const response = await contactListApi.getAllContactList(userId);
      if (response.code === 2000) {
        setContactLists(response.data);
      } else {
        setError("Failed to fetch contat list");
      }
    } catch (err) {
      setError("Error fetching contat list: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCampaigns();
    fetchTemplates();
    fetchContactLists();
  }, [userId]);

  const [newCampaign, setNewCampaign] = useState({
    userId: userId,
    name: "",
    templateId: "",
    messageContent: "",
    scheduleTime: "",
    contactListId: "",
    status: "SCHEDULED",
  });

  // -------------------- BADGE UI --------------------
  const getStatusBadge = (status) => {
    const styles = {
      COMPLETED: "bg-green-400/10 text-green-400 border-green-400/20",
      SCHEDULED: "bg-blue-400/10 text-blue-400 border-blue-400/20",
      SENDING: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
      FAILED: "bg-red-400/10 text-red-400 border-red-400/20",
    };
    const icons = {
      COMPLETED: CheckCircle,
      SCHEDULED: Clock,
      SENDING: Send,
      FAILED: XCircle,
    };
    const labels = {
      COMPLETED: "Hoàn thành",
      SCHEDULED: "Đã lên lịch",
      SENDING: "Đang gửi",
      FAILED: "Thất bại",
    };
    const Icon = icons[status];
    return (
      <span
        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 w-fit ${styles[status]}`}
      >
        <Icon size={14} />
        <span className="hidden sm:inline">{labels[status]}</span>
      </span>
    );
  };

  // -------------------- CRUD --------------------

  const handleOpenForm = (campaign = null) => {
    if (campaign) {
      setNewCampaign({
        id: campaign.id,
        userId: userId,
        name: campaign.name,
        templateId: campaign.templateId,
        messageContent: campaign.messageContent,
        scheduleTime: campaign.scheduleTime,
        contactListId: campaign.contactListId,
        status: campaign.status,
      });
    } else {
      setNewCampaign({
        name: "",
        templateId: "",
        messageContent: "",
        scheduleTime: "",
        contactListId: "",
        status: "SCHEDULED",
      });
    }
    setShowFormModal(true);
  };

  const handleSubmitCampaign = async () => {
    try {
      const payload = { ...newCampaign, userId };
      let response;

      if (newCampaign.id) {
        // Cập nhật
        response = await campaignApi.updateCampaign(newCampaign.id, payload);
      } else {
        // Thêm mới
        response = await campaignApi.createCampaign(payload);
        console.log(response);
      }

      if (response.code === 2000) {
        await fetchCampaigns();
        setShowFormModal(false);
        alert(response.message);
      } else {
        alert(response.message);
      }
    } catch (err) {
      alert("Lỗi khi lưu chiến dịch: " + err.message);
    }
  };

  const handleDeleteCampaign = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa chiến dịch này?")) return;
    try {
      const response = await campaignApi.deleteCampaign(id);
      if (response.code === 2000) {
        setCampaigns((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert("Không thể xóa chiến dịch!");
      }
    } catch (err) {
      alert("Lỗi khi xóa chiến dịch: " + err.message);
    }
  };

  const handleViewDetail = (campaign) => {
    navigate(`/campaign/${campaign.id}`, { state: { campaign } });
  };
  // handle send campaing mail
  const handleSendCampaignMail = async (id) => {
    try {
      setCampaigns((prevCampaigns) =>
        prevCampaigns.map((campaign) =>
          campaign.id === id ? { ...campaign, status: "SENDING" } : campaign
        )
      );

      const response = await campaignApi.sendCampaignMail(id);

      if (response.code === 2000) {
        alert(response.message);
        setCampaigns((prevCampaigns) =>
          prevCampaigns.map((campaign) =>
            campaign.id === id ? { ...campaign, status: "COMPLETED" } : campaign
          )
        );
      } else {
        alert(response.message);
        setCampaigns((prevCampaigns) =>
          prevCampaigns.map((campaign) =>
            campaign.id === id ? { ...campaign, status: "FAILED" } : campaign
          )
        );
      }
    } catch (error) {
      setCampaigns((prevCampaigns) =>
        prevCampaigns.map((campaign) =>
          campaign.id === id ? { ...campaign, status: "FAILED" } : campaign
        )
      );

      alert("Error: " + error);
    }
  };

  // -------------------- FILTER --------------------
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesStatus =
      filterStatus === "all" || campaign.status === filterStatus;
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // -------------------- UI --------------------
  if (loading) {
    return <LoadingSpinner message="Đang tải chiến dịch..." />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={fetchCampaigns} />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-3 sm:p-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
              Chiến dịch
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Quản lý các chiến dịch email marketing
            </p>
          </div>
          <button
            onClick={() => handleOpenForm()}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Tạo chiến dịch</span>
            <span className="sm:hidden">Tạo mới</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="SCHEDULED">Đã lên lịch</option>
                <option value="SENDING">Đang gửi</option>
                <option value="FAILED">Thất bại</option>
              </select>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6 hover:border-gray-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row items-start justify-between mb-3 sm:mb-4 gap-3">
                <div className="flex-1 w-full">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">
                    {campaign.name}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <FileText size={14} />
                      <span className="truncate">{campaign.templateName}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      <span className="truncate">
                        {campaign.contactListName}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {campaign.createdAt && formatVNDate(campaign.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {getStatusBadge(campaign.status)}
                  {campaign.status !== "SCHEDULED" && (
                    <button
                      onClick={() => handleViewDetail(campaign)}
                      className="px-2 sm:px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-2"
                      title="Xem chi tiết"
                    >
                      <Eye size={16} sm:size={18} />
                    </button>
                  )}
                  {campaign.status === "SCHEDULED" && (
                    <button
                      onClick={() => handleOpenForm(campaign)}
                      className="px-2 sm:px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-2"
                      title="Chỉnh sửa"
                    >
                      <Edit size={16} sm:size={18} />
                    </button>
                  )}
                  {campaign.status === "SCHEDULED" && (
                    <button
                      onClick={() => handleDeleteCampaign(campaign.id)}
                      className="px-2 sm:px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2"
                      title="Xóa"
                    >
                      <Trash2 size={16} sm:size={18} />
                    </button>
                  )}
                  {campaign.status === "SCHEDULED" && (
                    <button
                      onClick={() => handleSendCampaignMail(campaign.id)}
                      className="px-2 sm:px-3 py-2 bg-green-500 hover:bg-green-700 rounded-lg flex items-center gap-2"
                      title="Gửi"
                    >
                      <Send size={16} sm:size={18} />
                    </button>
                  )}
                  {campaign.status === "FAILED" && (
                    <button
                      onClick={() => handleSendCampaignMail(campaign.id)}
                      className="px-2 sm:px-3 py-2 bg-red-500 hover:bg-red-700 rounded-lg flex items-center gap-2"
                      title="Gửi lại"
                    >
                      <Send size={16} sm:size={18} />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-800">
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 mb-1">
                    {(campaign.status === "SCHEDULED" && "Chuẩn bị gửi") ||
                      (campaign.status === "COMPLETED" && "Đã gửi") ||
                      (campaign.status === "SENDING" && "Đang gửi")}
                  </p>
                  <p className="text-base sm:text-lg font-semibold">
                    {campaign.sentCount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 mb-1">
                    Người nhận
                  </p>
                  <p className="text-base sm:text-lg font-semibold">
                    {campaign.receivedCount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 mb-1">Tỷ lệ</p>
                  <p className="text-base sm:text-lg font-semibold text-green-400">
                    {campaign.sentCount > 0
                      ? (
                          (campaign.receivedCount / campaign.sentCount) *
                          100
                        ).toFixed(1) + "%"
                      : "0%"}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {filteredCampaigns.length === 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 sm:p-12 text-center">
              <Mail className="mx-auto mb-4 text-gray-600" size={40} />
              <p className="text-sm sm:text-base text-gray-400">
                Không tìm thấy chiến dịch nào
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Form */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3 sm:p-0">
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative">
            <button
              onClick={() => setShowFormModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              {newCampaign.id ? "Cập nhật chiến dịch" : "Tạo chiến dịch mới"}
            </h2>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm mb-1">Tên chiến dịch</label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, name: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg"
                  placeholder="Nhập tên chiến dịch"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Template</label>
                <select
                  value={newCampaign.templateId}
                  onChange={(e) =>
                    setNewCampaign({
                      ...newCampaign,
                      templateId: e.target.value,
                    })
                  }
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg"
                >
                  <option value="">-- Chọn template --</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.type})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Nội dung</label>
                <textarea
                  value={newCampaign.messageContent}
                  onChange={(e) =>
                    setNewCampaign({
                      ...newCampaign,
                      messageContent: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg resize-none"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm mb-1">Danh sách liên hệ</label>
                <select
                  value={newCampaign.contactListId}
                  onChange={(e) =>
                    setNewCampaign({
                      ...newCampaign,
                      contactListId: e.target.value,
                    })
                  }
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg"
                >
                  <option value="">-- Chọn danh sách --</option>
                  {contactLists.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.totalContacts} liên hệ)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSubmitCampaign}
              className="w-full mt-4 sm:mt-6 py-2.5 sm:py-3 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
            >
              {newCampaign.id ? "Cập nhật chiến dịch" : "Tạo chiến dịch"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Campaign;
