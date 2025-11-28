import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentFail() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="max-w-md w-full text-center p-8 bg-gray-800 rounded-2xl shadow-lg">
        <XCircle className="mx-auto mb-4 w-16 h-16 text-red-500" />
        <h1 className="text-2xl font-bold mb-2">Thanh toán thất bại!</h1>
       <p className="mb-6 text-gray-300">
  Có lỗi xảy ra khi thanh toán. Vui lòng thử lại hoặc liên hệ email: 
  <span className="text-blue-400 underline font-medium">truonglykhong2003@gmail.com</span> hỗ trợ.
</p>

        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
}
