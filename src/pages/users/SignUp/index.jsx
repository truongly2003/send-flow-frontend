import { Mail, User2, Lock } from "lucide-react";
import { userApi } from "@/services/userApi";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingModal from "@/components/LoadingModal";

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "12345",
    confirmPassword: "12345",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSubmit = async () => {
    if (!formData.email || !formData.password || !formData.name) {
      alert("Please enter complete information!");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Incorrect password re-entered!");
      return;
    }
    setIsProcessing(true);
    try {
      const res = await userApi.register(formData);
      console.log(res);
      navigate("/verify-otp", { state: { formData } });
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-800 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Đăng ký</h1>
            <p className="text-zinc-400 text-sm">Tạo tài khoản mới của bạn</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-zinc-300 text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-zinc-500" size={20} />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20 transition-all"
                />
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-zinc-300 text-sm font-medium mb-2">
                Tên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User2 className="text-zinc-500" size={20} />
                </div>
                <input
                  name="name"
                  type="text"
                  placeholder="Nhập tên của bạn"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-zinc-300 text-sm font-medium mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-zinc-500" size={20} />
                </div>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20 transition-all"
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-zinc-300 text-sm font-medium mb-2">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-zinc-500" size={20} />
                </div>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20 transition-all"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mr-2 rounded border-zinc-700 bg-zinc-950 text-white focus:ring-2 focus:ring-zinc-500/20"
              />
              <label htmlFor="terms" className="text-sm text-zinc-400 hover:text-zinc-300 cursor-pointer transition-colors">
                Tôi đồng ý với các điều khoản và điều kiện
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-white text-black font-semibold py-3 px-4 rounded-lg hover:bg-zinc-200 active:bg-zinc-300 transition-all duration-200 mt-2"
            >
              Đăng ký
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="px-4 text-zinc-500 text-sm">Hoặc đăng ký với</span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-sm font-medium">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-sm font-medium">Facebook</span>
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-zinc-400 text-sm">
              Bạn đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-white hover:text-zinc-300 font-medium transition-colors"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>

      <LoadingModal isProcessing={isProcessing} />
    </div>
  );
}

export default SignUp;