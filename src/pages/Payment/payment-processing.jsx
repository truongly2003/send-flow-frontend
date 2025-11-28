// PaymentProcessing.jsx
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { transactionApi } from "@/services/transactionApi";

export default function PaymentProcessing() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const txnId = params.get("transactionId");

  useEffect(() => {
    if (!txnId) return;

    const interval = setInterval(async () => {
      try {
        const res = await transactionApi.getStatus(txnId);
        console.log(res.status)
        if (res.status === "SUCCESS") {
          clearInterval(interval);
          navigate("/payment-success");
        } else if (res.status === "FAILED") {
          clearInterval(interval);
          navigate("/payment-fail");
        }
      } catch (err) {
        console.error(err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [txnId]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="text-center text-white p-6">
        <div className="flex justify-center mb-4">
          {/* Spinner */}
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Đang xác nhận thanh toán...</h1>
        <p>Vui lòng chờ trong ít giây. Không tắt trang này.</p>
      </div>
    </div>
  );
}
