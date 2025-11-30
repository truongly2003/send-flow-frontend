import { useState, useEffect } from "react";
import {
  Mail,
  Send,
  Users,
  Package,
  TrendingUp,
  Calendar,
  Plus,
  CheckCircle,
  Clock,
  BarChart3,
  ArrowUpRight,
  FileText,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { subscriptionApi } from "@services/subscriptionApi";
import { formatVNDate } from "@configs/formatVNDate";
import { dashBoardApi } from "@/services/dashBoardApi";
import { campaignApi } from "@/services/campaignApi";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { Link } from "react-router-dom";

function Dashboard() {
  const { userId } = useAuth();
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [dashboardData, setDashBoardData] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchCurrentSubscription = async () => {
    try {
      setLoading(true);
      const response = await subscriptionApi.getSubscriptionByUserId(userId);
      setCurrentSubscription(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const fetchDashBoardUser = async () => {
    try {
      setLoading(true);
      const response = await dashBoardApi.getDashBoardUser(userId);
      setDashBoardData(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaign = async () => {
    try {
      const response = await campaignApi.getAllCampaign(userId);
      const campaignFilter=response.data.filter(
        (c)=>c.status==="COMPLETED" || c.status==="FAILED"
      )
      setCampaigns(campaignFilter.slice(0, 3));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (!userId) return;
    fetchCurrentSubscription();
    fetchDashBoardUser();
    fetchCampaign();
  }, [userId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-400 bg-green-400/10";
      case "EXPIRED":
        return "text-yellow-400 bg-yellow-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const getQuotaColor = (percentage) => {
    if (percentage >= 80) return "bg-red-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-green-500";
  };
  const percentage = (dashboardData?.useMail / dashboardData?.limitMail) * 100;
  if (loading) {
    return <LoadingSpinner message="Đang tải ..." />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">
            Tổng quan hoạt động email marketing của bạn
          </p>
        </div>

        {/* Subscription Status Card */}
        {currentSubscription ? (
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Package className="text-blue-400" size={24} />
                  <h2 className="text-xl font-semibold">
                    Gói dịch vụ hiện tại
                  </h2>
                </div>
                <p className="text-2xl font-bold text-blue-400">
                  {currentSubscription?.planName}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  currentSubscription?.status
                )}`}
              >
                {currentSubscription?.status === "ACTIVE"
                  ? "Đang hoạt động"
                  : "Hết hạn"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar size={18} />
                <span className="text-sm">
                  Hết hạn: {formatVNDate(currentSubscription?.endTime)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Clock size={18} />
                <span className="text-sm">
                  Còn{" "}
                  {Math.ceil(
                    (new Date(currentSubscription?.endTime) -
                      new Date(currentSubscription?.startTime)) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  ngày
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br  text-red-600 from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-6 mb-6">
            Bạn chưa đăng ký gói dịch vụ. Vui lòng chọn gói để sử dụng hệ thống.
            <Link
              className="text-blue-400 underline pl-2 hover:text-blue-300"
              to="/plan"
            >
              Chọn gói tại đây
            </Link>
            .
          </div>
        )}

        {/* Quota Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Mail className="text-purple-400" size={24} />
              <h2 className="text-xl font-semibold">Hạn mức email</h2>
            </div>
            <span className="text-2xl font-bold text-purple-400">
              {dashboardData?.limitMail}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Đã sử dụng: {dashboardData?.useMail}</span>
              <span>Tổng: {dashboardData?.limitMail}</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full ${getQuotaColor(
                  percentage
                )} transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            {percentage >= 80 && (
              <p className="text-xs text-yellow-400">
                ⚠️ Hạn mức sắp hết, vui lòng nâng cấp gói dịch vụ
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button  className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-xl p-4 flex items-center justify-between group">
            <Link to="/campaign" className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Plus size={24} />
              </div>
              <span className="font-semibold">Tạo chiến dịch mới</span>
            </Link>
            <ArrowUpRight
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              size={20}
            />
          </button>

          <button className="bg-gray-800 hover:bg-gray-700 transition-colors rounded-xl p-4 flex items-center justify-between group border border-gray-700">
            <Link to="/contact-list" className="flex items-center gap-3">
              <div className="bg-green-500/20 p-2 rounded-lg">
                <Users className="text-green-400" size={24} />
              </div>
              <span className="font-semibold">Thêm liên hệ</span>
            </Link>
            <ArrowUpRight
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              size={20}
            />
          </button>

          <button className="bg-gray-800 hover:bg-gray-700 transition-colors rounded-xl p-4 flex items-center justify-between group border border-gray-700">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <BarChart3 className="text-purple-400" size={24} />
              </div>
              <span className="font-semibold">Xem báo cáo</span>
            </div>
            <ArrowUpRight
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              size={20}
            />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <Send className="text-blue-400" size={20} />
              </div>
              <TrendingUp className="text-green-400" size={18} />
            </div>
            <p className="text-gray-400 text-sm mb-1">Tổng email đã gửi</p>
            <p className="text-3xl font-bold">{dashboardData?.useMail}</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-purple-500/10 p-2 rounded-lg">
                <Mail className="text-purple-400" size={20} />
              </div>
              <TrendingUp className="text-green-400" size={18} />
            </div>
            <p className="text-gray-400 text-sm mb-1">Tổng chiến dịch</p>
            <p className="text-3xl font-bold">
              {dashboardData?.totalCampaigns}
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-green-500/10 p-2 rounded-lg">
                <Users className="text-green-400" size={20} />
              </div>
              <TrendingUp className="text-green-400" size={18} />
            </div>
            <p className="text-gray-400 text-sm mb-1">Tổng liên hệ</p>
            <p className="text-3xl font-bold">{dashboardData?.totalContacts}</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-green-500/10 p-2 rounded-lg">
                <FileText className="text-green-400" size={20} />
              </div>
              <TrendingUp className="text-green-400" size={18} />
            </div>
            <p className="text-gray-400 text-sm mb-1">Tổng template</p>
            <p className="text-3xl font-bold">{dashboardData?.totalTemplate}</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-yellow-500/10 p-2 rounded-lg">
                <CheckCircle className="text-yellow-400" size={20} />
              </div>
              <TrendingUp className="text-green-400" size={18} />
            </div>
            <p className="text-gray-400 text-sm mb-1">Tỷ lệ thành công</p>
            <p className="text-3xl font-bold">
              {dashboardData?.totalCampaignRating.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Recent Campaigns */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Chiến dịch gần đây</h2>
          <div className="space-y-3">
            {campaigns.length>0 ? (
              campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-500/10 p-3 rounded-lg">
                      <Mail className="text-blue-400" size={20} />
                    </div>
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-sm text-gray-400">
                        {campaign.createdAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-right">
                      <p className="text-gray-400">Đã gửi</p>
                      <p className="font-semibold">{campaign.sentCount}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400">Tỷ lệ</p>
                      <p className="font-semibold text-green-400">
                        {(
                          (campaign.receivedCount / campaign.sentCount) *
                          100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>Chưa có chiến dịch nào</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
