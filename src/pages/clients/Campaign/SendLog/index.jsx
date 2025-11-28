import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendLogApi } from "@services/sendLogApi";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { ErrorDisplay } from "@components/ErrorDisplay";
import { formatVNDate } from "@configs/formatVNDate";
import { Filter } from "lucide-react";
const SendLog = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const campaign = location.state?.campaign;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // getAllCampaign
  const [page, setPage] = useState(0);
  const size = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [sendLogs, setSendLogs] = useState([]);
  const fetchSendLog = async () => {
    try {
      setLoading(true);
      const response = await sendLogApi.getAllCampaign(campaign.id, page, size);
      if (response.code === 2000) {
        setSendLogs(response.data.content);
        setTotalPages(response.data.totalPages);
      } else {
        setError("Failed to fetch send log");
      }
    } catch (err) {
      setError("Error fetching send log: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSendLog();
  }, [campaign, page, size]);

  const getLogStatusBadge = (status) => {
    const styles = {
      SENT: "bg-blue-400/10 text-blue-400",
      DELIVERED: "bg-green-400/10 text-green-400",
      BOUNCED: "bg-orange-400/10 text-orange-400",
      FAILED: "bg-red-400/10 text-red-400",
      OPENED: "bg-purple-400/10 text-purple-400",
      CLICKED: "bg-cyan-400/10 text-cyan-400",
    };
    const labels = {
      SENT: "Đã gửi",
      DELIVERED: "Đã nhận",
      BOUNCED: "Bị trả về",
      FAILED: "Thất bại",
      OPENED: "Đã mở",
      CLICKED: "Đã click",
    };
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };
  // search and filter
  const [filterStatus, setFilterStatus] = useState("all");
  const filterSendlog = sendLogs.filter((log) => {
    const matchesStatus = filterStatus === "all" || log.status === filterStatus;
    return matchesStatus;
  });
  //
  if (loading) {
    return <LoadingSpinner message="Đang tải send log..." />;
  }

  if (error) {
    return (
      <ErrorDisplay message={error} onRetry={() => window.location.reload()} />
    );
  }
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Send Log - {campaign.name}
            </h1>
            <p className="text-gray-400">Lịch sử gửi tin nhắn chi tiết</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Quay lại
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">Tổng số</div>
            <div className="text-2xl font-bold">{campaign.sentCount}</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">Đã gửi</div>
            <div className="text-2xl font-bold text-blue-400">
              {campaign.sentCount}
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">Thành công</div>
            <div className="text-2xl font-bold text-green-400">
              {campaign.receivedCount}
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">Thất bại</div>
            <div className="text-2xl font-bold text-red-400">
              {campaign.sentCount - campaign.receivedCount}
            </div>
          </div>
        </div>
        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-4">
            <Filter size={18} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-52 sm:flex-none px-3 sm:px-4 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="SENT">Đã gửi</option>
              <option value="DELIVERED">Đã nhận</option>
              <option value="BOUNCED">Bị trả về</option>
              <option value="FAILED">Thất bại</option>
              <option value="OPENED">Đã mở</option>
              <option value="CLICKED">Đã click</option>
            </select>
          </div>
        </div>

        {/* Send Log Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Chi tiết gửi email</h2>
            <span className="text-sm text-gray-400">
              Tổng: {campaign.sentCount} lượt gửi
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    STT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Đã click
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Đã mở
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filterSendlog.map((log, index) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {log.recipientEmail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getLogStatusBadge(log.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {formatVNDate(log.sentAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {log.clickedAt && formatVNDate(log.clickedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {log.openedAt && formatVNDate(log.openedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-800 flex items-center justify-between">
            <div className="flex justify-between items-center mt-6 space-x-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50"
              >
                Trang trước
              </button>
              <span>
                Trang {page + 1} / {totalPages}
              </span>
              <button
                disabled={page + 1 >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50"
              >
                Trang sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SendLog;
