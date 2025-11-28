import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CreditCard,
  Wallet,
  Check,
  ArrowLeft,
  Package,
  Calendar,
  Mail,
  Phone,
  User,
  ShieldCheck,
  Loader,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { transactionApi } from "@/services/transactionApi";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan;
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("VNPAY");
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  // Billing info từ user (disabled, không edit)
  const [billingInfo] = useState({
    userId: user.userId,
    fullName: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
  });

  const paymentMethods = [
    {
      id: "VNPAY",
      name: "VNPAY",
      icon: Wallet,
      description: "Thanh toán qua VNPAY QR",
      logo: "🏦",
    },
    {
      id: "momo",
      name: "Momo",
      icon: Wallet,
      description: "Ví điện tử Momo",
      logo: "💳",
    },
    {
      id: "banking",
      name: "Chuyển khoản ngân hàng",
      icon: CreditCard,
      description: "Chuyển khoản trực tiếp",
      logo: "🏦",
    },
  ];

  // thanh toán
  const handlePayment = async () => {
    if (paymentMethod !== "VNPAY") {
      alert("Phương thức này chưa được hỗ trợ!");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const payment = {
        userId: billingInfo.userId,
        planId: plan.id,
        amount: plan.price,
        paymentMethod: paymentMethod,
      };
      const data = await transactionApi.createUrlPayment(payment);
      if (data.success) {
        window.location.href = data.paymentUrl;
      } else {
        setError(data.message || "Lỗi tạo thanh toán!");
      }
    } catch (err) {
      setError("Lỗi kết nối: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Xử lý redirect VNPAY
  const handleReturnUrl = async () => {
    const urlParams = new URLSearchParams(location.search);
    const vnpParams = {};
    for (let [key, value] of urlParams) {
      if (key.startsWith("vnp_")) vnpParams[key] = value;
    }
    if (Object.keys(vnpParams).length === 0) return;
    setStatus("processing");
    try {
      const data = await transactionApi.returnPayment(vnpParams);
      console.log(data)
      if (data.success) {
        alert("Thanh toán thành công");
      } else {
        setError(data.message || "Thanh toán thất bại!");
        setStatus("failed");
      }
    } catch (err) {
      setError("Lỗi xử lý callback: " + err.message);
      setStatus("failed");
    }
  };

  useEffect(() => {
    handleReturnUrl();
  }, [location.search]); // Chạy khi URL thay đổi (query params)

  // Nếu chưa có plan, redirect về
  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={64} className="mx-auto mb-4 text-red-400" />
          <h1 className="text-2xl font-bold mb-2">
            Không tìm thấy gói dịch vụ
          </h1>
          <button
            onClick={() => navigate("/plan")}
            className="bg-blue-600 px-6 py-2 rounded-lg"
          >
            Chọn gói
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/plan")}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Quay lại
          </button>
          <h1 className="text-3xl font-bold mb-2">Thanh toán</h1>
          <p className="text-gray-400">
            Hoàn tất thanh toán để kích hoạt gói dịch vụ
          </p>
        </div>

        {/* Error Alert nếu có */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="text-red-400" size={20} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Billing Information - Giữ nguyên, disabled */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User size={20} />
                Thông tin thanh toán
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={billingInfo.fullName}
                    disabled
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="email"
                      value={billingInfo.email}
                      disabled
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="tel"
                      value={billingInfo.phone}
                      disabled
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method - Giữ nguyên */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard size={20} />
                Phương thức thanh toán
              </h2>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    disabled={isProcessing}
                    className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-4 ${
                      paymentMethod === method.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-700 bg-gray-800 hover:border-gray-600"
                    } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="text-3xl">{method.logo}</div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold">{method.name}</p>
                      <p className="text-sm text-gray-400">
                        {method.description}
                      </p>
                    </div>
                    {paymentMethod === method.id && (
                      <div className="bg-blue-500 rounded-full p-1">
                        <Check size={16} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Security Notice - Giữ nguyên */}
            <div className="bg-green-900/20 border border-green-500/20 rounded-xl p-4 flex items-start gap-3">
              <ShieldCheck
                className="text-green-400 flex-shrink-0 mt-0.5"
                size={20}
              />
              <div className="text-sm">
                <p className="font-semibold text-green-400 mb-1">
                  Thanh toán an toàn
                </p>
                <p className="text-gray-400">
                  Thông tin thanh toán của bạn được mã hóa và bảo mật. Chúng tôi
                  không lưu trữ thông tin thẻ của bạn.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary - Sửa total price */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>

              {/* Package Info - Giữ nguyên */}
              <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-400/10 p-2 rounded-lg">
                    <Package className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">{plan.name}</p>
                    <p className="text-sm text-gray-400">{plan.duration}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Check size={14} className="text-green-400" />
                    Chiến dịch <span>{plan.maxCampaignsPerMonth}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Check size={14} className="text-green-400" />
                    Email <span>{plan.maxEmailsPerMonth}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Check size={14} className="text-green-400" />
                    Liên hệ <span>{plan.maxContacts}</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown - Giữ nguyên */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Giá gói</span>
                  <span>{plan.price.toLocaleString("vi-VN")} đ</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">VAT (0%)</span>
                  <span>0 đ</span>
                </div>
              </div>

              {/* Total - Sửa: Hiển thị plan.price */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-semibold">Tổng cộng</span>
                <span className="text-2xl font-bold text-blue-400">
                  {plan.price.toLocaleString("vi-VN")} đ
                </span>
              </div>

              {/* Payment Button - Disabled khi processing hoặc status không PENDING */}
              <button
                onClick={handlePayment}
                disabled={
                  isProcessing || status === "SUCCESS" || status === "FAILED"
                }
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Đang xử lý...
                  </>
                ) : status === "SUCCESS" ? (
                  <>
                    <Check size={20} className="text-green-400" />
                    Thành công!
                  </>
                ) : status === "FAILED" ? (
                  <>
                    <AlertCircle size={20} className="text-red-400" />
                    Thất bại
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Thanh toán ngay
                  </>
                )}
              </button>

              {/* Activation Info - Giữ nguyên */}
              <div className="mt-4 text-xs text-gray-400 text-center">
                <Calendar className="inline mr-1" size={14} />
                Gói dịch vụ sẽ được kích hoạt ngay sau khi thanh toán thành công
              </div>

              {/* Status Display nếu đang poll */}
              {status === "processing" && (
                <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/20 rounded-lg text-sm text-yellow-300">
                  <Loader className="inline mr-2 animate-spin" size={16} />
                  Đang kiểm tra trạng thái thanh toán...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
