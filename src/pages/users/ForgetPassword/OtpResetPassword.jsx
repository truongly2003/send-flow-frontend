import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "@/services/userApi";

function OtpResetPassword() {
  const [data, setData] = useState({
    email: "",
    newPassword: "",
    otp: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!data.email || !data.newPassword || !data.otp) {
      alert("Please enter complete information.");
      return;
    }

    try {
      const response = await userApi.resetPassword(data);
      if (response.code === 2000) {
        alert(response.message);
        navigate("/login");
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-zinc-400 text-sm">Enter the OTP sent to your email</p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            <div>
              <label className="block text-zinc-300 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-zinc-300 text-sm font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                value={data.newPassword}
                onChange={(e) => setData({ ...data, newPassword: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-zinc-300 text-sm font-medium mb-2">
                OTP Code
              </label>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={data.otp}
                onChange={(e) => setData({ ...data, otp: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20 transition-all text-center text-2xl tracking-widest"
                maxLength="6"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-white text-black font-semibold py-3 px-4 rounded-lg hover:bg-zinc-200 active:bg-zinc-300 transition-all duration-200 mt-6"
            >
              Reset Password
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-zinc-400 text-sm hover:text-white transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtpResetPassword;