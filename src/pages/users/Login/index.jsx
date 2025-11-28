import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { userApi } from "@/services/userApi";

function Login() {
  const [data, setData] = useState({
    email: "",
    password: "12345",
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async () => {
    if (!data.email || !data.password) {
      alert("Please enter complete information!");
      return;
    }
    try {
      const response = await userApi.login(data);
      if (response.code === 2000) {
        const user = response.data;
        alert(response.message);
        localStorage.setItem("user", JSON.stringify(user));
        if (user.role === "ADMIN") window.location.href = "/admin/dashboard";
        if (user.role === "USER") window.location.href = "/dashboard";
      } else {
        alert(response.message);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-800 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Đăng nhập</h1>
            <p className="text-zinc-400 text-sm">Chào mừng bạn trở lại</p>
          </div>

          {/* Form */}
          <div className="space-y-5">
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
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={data.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-zinc-300 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-zinc-500" size={20} />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={data.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20 transition-all"
                />
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-zinc-400 hover:text-zinc-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  className="w-4 h-4 mr-2 rounded border-zinc-700 bg-zinc-950 text-white focus:ring-2 focus:ring-zinc-500/20"
                />
                Nhớ mật khẩu
              </label>
              <Link
                to="/forgot-password"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full bg-white text-black font-semibold py-3 px-4 rounded-lg hover:bg-zinc-200 active:bg-zinc-300 transition-all duration-200 mt-2"
            >
              Đăng nhập
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="px-4 text-zinc-500 text-sm">Hoặc đăng nhập với</span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>

          {/* Social Login Buttons */}
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
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span className="text-sm font-medium">GitHub</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-zinc-400 text-sm">
              Bạn chưa có tài khoản?{" "}
              <Link
                to="/sign-up"
                className="text-white hover:text-zinc-300 font-medium transition-colors"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;