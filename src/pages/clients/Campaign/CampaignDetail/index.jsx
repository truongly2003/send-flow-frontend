import {
  Calendar,
  Users,
  CheckCircle,
  Eye,
  Send,
  Clock,
  XCircle,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatVNDate } from "@configs/formatVNDate";
// import SendLog from "../SendLog.jsx"
const CampaignDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const campaign = location.state?.campaign;
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
        className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 w-fit ${styles[status]}`}
      >
        <Icon size={14} />
        {labels[status]}
      </span>
    );
  };
  const progressPercentage =
    (campaign.receivedCount / campaign.sentCount) * 100;
  const handleViewSendlog = (campaign) => {
    navigate(`/campaign/${campaign.id}/sendlog`, { state: { campaign } });
  };
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{campaign.name}</h1>
            <p className="text-gray-400">Chi tiết chiến dịch</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Quay lại
          </button>
        </div>

        {/* Status Overview */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {getStatusBadge(campaign.status)}
              <div className="text-sm text-gray-400">
                <Calendar className="inline mr-1" size={16} />
                {formatVNDate(campaign.scheduleTime)}
              </div>
            </div>
            <button
              onClick={() => handleViewSendlog(campaign)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <Eye size={18} />
              Xem Send Log
            </button>
          </div>

          {/* Progress Bar - Hiển thị khi đang gửi */}
          {campaign.status === "SENDING" && (
            <div className="mb-6 bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Send className="text-blue-400 animate-pulse" size={20} />
                  <span className="text-sm font-medium">
                    Tiến trình gửi tin
                  </span>
                </div>
                <span className="text-sm text-gray-400">
                  {campaign.sentCount} / {campaign.totalRecipients}
                </span>
              </div>
              <div className="relative w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-gray-400">
                  Tỷ lệ hoàn thành: {progressPercentage.toFixed(1)}%
                </span>
                <span className="text-blue-400 flex items-center gap-1">
                  <Clock size={12} />
                  Đang xử lý...
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Send className="text-blue-400" size={20} />
                <span className="text-sm text-gray-400">Đã gửi</span>
              </div>
              <p className="text-2xl font-bold">
                {campaign.sentCount.toLocaleString()}
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="text-purple-400" size={20} />
                <span className="text-sm text-gray-400">Người nhận</span>
              </div>
              <p className="text-2xl font-bold">
                {campaign.receivedCount.toLocaleString()}
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-green-400" size={20} />
                <span className="text-sm text-gray-400">Tỷ lệ thành công</span>
              </div>
              <p className="text-2xl font-bold text-green-400">
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

        {/* Chart Placeholder */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Biểu đồ thống kê</h2>
          <div className="h-64 bg-gray-800/30 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">
              Chart: Sent Count vs Recipient Count
            </p>
          </div>
        </div>

        {/* Campaign Info */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Thông tin chiến dịch</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Template:</span>
              <span className="font-medium">{campaign.templateName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Danh sách liên hệ:</span>
              <span className="font-medium">{campaign.contactListName}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400">Thời gian lên lịch:</span>
              <span className="font-medium">
                {formatVNDate(campaign.scheduleTime)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CampaignDetail;
