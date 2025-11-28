import { useState, useEffect } from "react";
import {
  Search,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { transactionApi } from "@services/transactionApi";
import { formatVNDate } from "@configs/formatVNDate";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { ErrorDisplay } from "@components/ErrorDisplay";
function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const size = 10;
  const [totalPages, setTotalPages] = useState(0);
  const fetchTransaction = async () => {
    try {
      setLoading(true);
      const response = await transactionApi.getAllTransaction(page, size);
      console.log(response.content)
      setTransactions(response.content);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError("Error fetching transaction: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTransaction();
  }, [page, size]);

  const handleRefund = (transaction) => {
    if (
      confirm(
        `Bạn có chắc muốn refund giao dịch ${
          transaction.id
        }?\nSố tiền: ${transaction.amount.toLocaleString()} VNĐ`
      )
    ) {
      setTransactions(
        transactions.map((t) =>
          t.id === transaction.id
            ? {
                ...t,
                paymentStatus: "refunded",
                refundDate: new Date().toISOString().split("T")[0],
              }
            : t
        )
      );
      alert("Đã gửi yêu cầu refund thành công!");
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesStatus =
      filterStatus === "all" || transaction.paymentStatus === filterStatus;
    const matchesSearch =
      // transaction.id.includes(searchQuery.toLowerCase()) ||
      transaction.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "SUCCESS":
        return "text-green-400 bg-green-400/10";
      case "FAILED":
        return "text-red-400 bg-red-400/10";
      case "PENDING":
        return "text-yellow-400 bg-yellow-400/10";
      case "REFUNDED":
        return "text-blue-400 bg-blue-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "SUCCESS":
        return <CheckCircle size={16} />;
      case "FAILED":
        return <XCircle size={16} />;
      case "PENDING":
        return <Clock size={16} />;
      case "REFUNDED":
        return <RefreshCw size={16} />;
      default:
        return null;
    }
  };

  const totalRevenue = transactions
    .filter((t) => t.paymentStatus === "SUCCESS")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalFailed = transactions.filter(
    (t) => t.paymentStatus === "FAILED"
  ).length;
  const totalPending = transactions.filter(
    (t) => t.paymentStatus === "PENDING"
  ).length;
  if (loading) {
    return <LoadingSpinner message="Đang tải gói danh sách liên hệ..." />;
  }

  if (error) {
    return (
      <ErrorDisplay message={error} onRetry={() => window.location.reload()} />
    );
  }
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Transactions</h1>
          <p className="text-gray-400">Quản lý giao dịch và xử lý refund</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="text-green-400" size={24} />
              <span className="text-gray-400 text-sm">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {totalRevenue.toLocaleString()} đ
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="text-green-400" size={24} />
              <span className="text-gray-400 text-sm">Success</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {
                transactions.filter((t) => t.paymentStatus === "SUCCESS")
                  .length
              }
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="text-red-400" size={24} />
              <span className="text-gray-400 text-sm">Failed</span>
            </div>
            <p className="text-2xl font-bold text-white">{totalFailed}</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="text-yellow-400" size={24} />
              <span className="text-gray-400 text-sm">Pending</span>
            </div>
            <p className="text-2xl font-bold text-white">{totalPending}</p>
          </div>
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
                placeholder="Tìm kiếm theo ID, user name hoặc email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filterStatus === "all"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilterStatus("SUCCESS")}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filterStatus === "SUCCESS"
                    ? "bg-green-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Success
              </button>
              <button
                onClick={() => setFilterStatus("FAILED")}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filterStatus === "FAILED"
                    ? "bg-red-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Failed
              </button>
              <button
                onClick={() => setFilterStatus("PENDING")}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filterStatus === "PENDING"
                    ? "bg-yellow-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Pending
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    ID
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
                    Payment Method
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredTransactions.map((transaction) => (
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
                      <div>
                        <p className="font-medium text-white">
                          {transaction.userName}
                        </p>
                        <p className="text-sm text-gray-400">
                          {transaction.userEmail}
                        </p>
                      </div>
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
                      <p className="text-gray-400">
                        {transaction.paymentMethod}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            transaction.paymentStatus
                          )}`}
                        >
                          {getStatusIcon(transaction.paymentStatus)}
                          {transaction.paymentStatus}
                        </span>
                        {transaction.failureReason && (
                          <p className="text-xs text-red-400 mt-1">
                            {transaction.failureReason}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-400">
                        {formatVNDate(transaction.createdAt)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {transaction.paymentStatus === "FAILED" && (
                          <button
                            onClick={() => handleRefund(transaction)}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                          >
                            <RefreshCw size={14} />
                            Refund
                          </button>
                        )}
                        {transaction.paymentStatus === "SUCCESS" && (
                          <span className="text-xs text-gray-500">
                            No actions
                          </span>
                        )}
                        {transaction.paymentStatus === "PENDING" && (
                          <span className="text-xs text-yellow-400">
                            Waiting...
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-6">
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

        {filteredTransactions.length === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center mt-6">
            <DollarSign className="mx-auto mb-4 text-gray-600" size={48} />
            <p className="text-gray-400">Không tìm thấy giao dịch nào</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Transaction;
