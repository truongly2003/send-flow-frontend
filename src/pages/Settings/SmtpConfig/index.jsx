import { useState } from "react";
import { smtpApi } from "@/services/smtpApi";
import {useAuth} from "@/contexts/AuthContext"
function SmtpConfig() {
  const {user}=useAuth()
  const [smtpData, setSmtpData] = useState({
    userId:user.userId,
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    usernameSmtp: "your-email@gmail.com",
    passwordSmtp: "",
    encryption: "TLS",
    fromName: "BlogHub System",
    fromEmail: "noreply@bloghub.com",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loadingTest, setLoadingTest] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const handleChange = (e) => {
    setSmtpData({
      ...smtpData,
      [e.target.name]: e.target.value,
    });
  };
// ovphdybzopmxtukn
  // 🟢 Test SMTP
  const handleTest = async () => {
    setLoadingTest(true);
    try {
      const response = await smtpApi.testSmtp(smtpData);
      alert(response.message);
    } catch (err) {
      console.log(err)
      alert(err.response.data.message);
    }
    setLoadingTest(false);
  };

  // 🟣 Save SMTP
  const handleSave = async () => {
    setLoadingSave(true);
    try {
      const result = await smtpApi.saveSmtp(smtpData);
      alert("Đã lưu cấu hình SMTP!");
      console.log(result);
    } catch (err) {
      alert("Lưu cấu hình thất bại!");
    }
    setLoadingSave(false);
  };

  const handleCancel = () => {
    if (window.confirm("Bạn có chắc muốn hủy thay đổi?")) {
      window.location.reload();
    }
  };

  return (
    <div className="h-screen">
      {/* Warning Alert */}
      <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
        <div className="text-yellow-600 mt-0.5">⚠</div>
        <div>
          <div className="font-semibold text-yellow-800 mb-1">Lưu ý quan trọng</div>
          <div className="text-sm text-yellow-700">
            Thông tin SMTP sẽ được sử dụng để gửi email thông báo, xác thực và các email hệ thống khác. Vui lòng đảm bảo thông tin chính xác.
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {/* Row 1 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">SMTP Host</label>
            <input
              type="text"
              name="smtpHost"
              value={smtpData.smtpHost}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Port</label>
            <input
              type="text"
              name="smtpPort"
              value={smtpData.smtpPort}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-200"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Username</label>
            <input
              type="text"
              name="usernameSmtp"
              value={smtpData.usernameSmtp}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="passwordSmtp"
                value={smtpData.passwordSmtp}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md pr-10 text-gray-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Mã hóa</label>
            <select
              name="encryption"
              value={smtpData.encryption}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-200"
            >
              <option value="TLS">TLS</option>
              <option value="SSL">SSL</option>
              <option value="None">None</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Tên người gửi</label>
            <input
              type="text"
              name="fromName"
              value={smtpData.fromName}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-200"
            />
          </div>
        </div>

        {/* Reply To */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Email người gửi</label>
          <input
            type="text"
            name="fromEmail"
            value={smtpData.fromEmail}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-200"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            disabled={loadingTest}
            onClick={handleTest}
            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {loadingTest ? "Đang kiểm tra..." : "✓ Kiểm tra kết nối"}
          </button>

          <button
            disabled={loadingSave}
            onClick={handleSave}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50"
          >
            {loadingSave ? "Đang lưu..." : "Lưu cấu hình"}
          </button>

          <button
            onClick={handleCancel}
            className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium"
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
}

export default SmtpConfig;
