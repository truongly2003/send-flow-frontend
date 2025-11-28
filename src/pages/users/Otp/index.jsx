import { userApi } from "@/services/userApi";
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Shield, Mail, ArrowLeft } from "lucide-react";

function Otp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);
  const formData = location.state?.formData;

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Vui lòng nhập đầy đủ mã OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await userApi.verifyOtp(formData.email, otpString);
      if (response.code === 2000) {
        alert(response.message);
        navigate("/login");
      }
    } catch (error) {
      setError("Mã OTP không đúng hoặc đã hết hạn");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    // Add resend OTP logic here
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Quay lại</span>
        </button>

        {/* Main Card */}
        <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-zinc-800">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="text-white" size={36} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Xác thực OTP
          </h1>

          {/* Email Info */}
          <div className="flex items-center justify-center gap-2 text-zinc-400 mb-8">
            <Mail size={16} />
            <p className="text-sm">
              Mã đã được gửi đến{" "}
              <span className="text-white font-medium">{formData?.email}</span>
            </p>
          </div>

          {/* OTP Input */}
          <div className="mb-6">
            <label className="block text-zinc-300 text-sm font-medium mb-4 text-center">
              Nhập mã OTP (6 chữ số)
            </label>
            <div className="flex gap-3 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold bg-zinc-950 border-2 border-zinc-700 rounded-lg text-white focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                />
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-950/50 border border-red-900/50 rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={isLoading || otp.join("").length !== 6}
            className="w-full bg-white text-black font-semibold py-4 rounded-lg hover:bg-zinc-200 active:bg-zinc-300 transition-all duration-200 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed mb-5 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Đang xác thực...</span>
              </>
            ) : (
              <span>Xác thực</span>
            )}
          </button>

          {/* Resend */}
          <div className="text-center pt-2 border-t border-zinc-800">
            <p className="text-zinc-400 text-sm mt-4">
              Không nhận được mã?{" "}
              <button
                onClick={handleResend}
                className="text-white hover:text-zinc-300 font-medium transition-colors underline underline-offset-2"
              >
                Gửi lại
              </button>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-zinc-600 text-xs">
            Mã OTP có hiệu lực trong 5 phút
          </p>
        </div>
      </div>
    </div>
  );
}

export default Otp