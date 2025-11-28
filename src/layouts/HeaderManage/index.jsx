import { Search, User } from "lucide-react";

function HeaderManage() {
  return (
    <header className="bg-black text-white shadow-md">
      <div className="flex items-center justify-between px-8 py-5">
        {/* Ô tìm kiếm */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full bg-gray-800  text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent placeholder-gray-400"
            />
          </div>
        </div>

        {/* Thông tin người dùng */}
        <div className="flex items-center gap-3 ml-6">
          <div className="text-right">
            <p className="text-sm font-medium">Nguyễn Văn A</p>
            <p className="text-xs text-gray-400">Người dùng</p>
          </div>
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center border-2 border-gray-600">
            <User className="w-6 h-6 text-gray-300" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeaderManage;
