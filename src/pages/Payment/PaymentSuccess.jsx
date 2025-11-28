import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="max-w-md w-full text-center p-8 bg-gray-800 rounded-2xl shadow-lg">
        <CheckCircle className="mx-auto mb-4 w-16 h-16 text-green-500" />
        <h1 className="text-2xl font-bold mb-2">Thanh toán thành công!</h1>
        <p className="mb-6">
          Cảm ơn bạn đã thanh toán. Gói của bạn đã được kích hoạt.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
        >
          Bắt đầu chiến dịch nào
        </button>
      </div>
    </div>
  );
}
