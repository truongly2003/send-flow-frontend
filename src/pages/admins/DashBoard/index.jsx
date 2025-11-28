import { useState, useEffect } from "react";
import {
  Users,
  Mail,
  DollarSign,
  TrendingUp,
  Activity,
  CheckCircle,
} from "lucide-react";
import { dashBoardApi } from "@/services/dashBoardApi";
import { transactionApi } from "@/services/transactionApi";
import { formatVNDate } from "@configs/formatVNDate";
import { formatVND } from "@configs/formatVND";

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCampaigns: 0,
    totalRevenue: 0,
    emailsSent: 0,
    activeSubscriptions: 0,
    successRate: 0,
  });
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [revenues, setRevenues] = useState([]);

  //
  const fetchDashBoardAdmin = async () => {
    try {
      const response = await dashBoardApi.getDashBoardAdmin();
      setStats({
        totalUsers: response.data.totalUsers,
        totalCampaigns: response.data.totalCampaigns,
        totalRevenue: response.data.totalRevenue,
        emailsSent: response.data.emailsSent,
        activeSubscriptions: response.data.activeSubscriptions,
        successRate: response.data.successRate,
      });
    } catch (err) {
      console.log(err);
    }
  };
  // transaction
  const fetchTransactionRecent = async () => {
    try {
      const response = await transactionApi.getAllTransaction();
      setRecentTransactions(response.content.slice(0, 3));
    } catch (err) {
      console.log(err);
    }
  };
  // revenue
  const fetchRevenue = async () => {
    try {
      const response = await dashBoardApi.getRevenue(year, month);
      setRevenues(response);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchDashBoardAdmin();
    fetchTransactionRecent();
  }, []);
  useEffect(() => {
    fetchRevenue();
  }, [year, month]);

  const getStatusColor = (status) => {
    switch (status) {
      case "SUCCESS":
        return "text-green-400 bg-green-400/10";
      case "FAILED":
        return "text-red-400 bg-red-400/10";
      case "PENDING":
        return "text-yellow-400 bg-yellow-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">
            Tổng quan hệ thống gửi email hàng loạt
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Total Users */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Users className="text-blue-400" size={24} />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">Total Users</p>
            <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
          </div>

          {/* Total Campaigns */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Mail className="text-purple-400" size={24} />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">Total Campaigns</p>
            <p className="text-3xl font-bold text-white">
              {stats.totalCampaigns}
            </p>
          </div>

          {/* Total Revenue */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <DollarSign className="text-green-400" size={24} />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-white">
              {stats.totalRevenue.toLocaleString()} đ
            </p>
          </div>

          {/* Emails Sent */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyan-500/10 rounded-lg">
                <Activity className="text-cyan-400" size={24} />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">Emails Sent</p>
            <p className="text-3xl font-bold text-white">
              {stats.emailsSent.toLocaleString()}
            </p>
          </div>

          {/* Active Subscriptions */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <TrendingUp className="text-orange-400" size={24} />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">Active Subscriptions</p>
            <p className="text-3xl font-bold text-white">
              {stats.activeSubscriptions}
            </p>
          </div>

          {/* Success Rate */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle className="text-green-400" size={24} />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">Success Rate</p>
            <p className="text-3xl font-bold text-white">
              {stats.successRate}%
            </p>
          </div>
        </div>

        {/* Charts & Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
          {/* Revenue by Package */}

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 ">
            <h2 className="text-xl font-bold text-white mb-4">
              Revenue by Plan
            </h2>
            {/* Filters */}
            <div className="flex gap-3 mb-4">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="bg-gray-800 text-white px-3 py-2 rounded-lg"
              >
                {[2023, 2024, 2025].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="bg-gray-800 text-white px-3 py-2 rounded-lg"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Tháng {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              {revenues.length ? (
                revenues.map((revenue, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
                  >
                    <div>
                      <p className="text-white font-medium">
                        {revenue.planName}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {revenue.subscribers}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{formatVND(revenue.revenue)}</p>
                      <p className="text-green-400 text-sm">
                        {revenue.percent}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="">No revenue</div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">
              Recent Transactions
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Transaction ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Package
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {recentTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-mono text-sm text-blue-400">
                        {transaction.id}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">{transaction.userName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">{transaction.planName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-white">
                        {transaction.amount.toLocaleString()} đ
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          transaction.paymentStatus
                        )}`}
                      >
                        {transaction.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-400">
                        {formatVNDate(transaction.createdAt)}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
