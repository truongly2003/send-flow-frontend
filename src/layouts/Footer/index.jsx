import {
  Github,
  Linkedin,
  Heart,
  ArrowUp,
  Facebook,
  Twitter,
} from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 shadow-sm text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* About Section */}
          <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
            <h3 className="text-xl sm:text-2xl font-bold ">SendFlow</h3>
            <p className=" text-xs sm:text-sm leading-relaxed">
              Nhà phát triển đầy nhiệt huyết tạo ra các giải pháp sáng tạo với
              công nghệ hiện đại. Hãy cùng nhau xây dựng điều gì đó tuyệt vời!
            </p>
            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10  rounded-full flex items-center justify-center  transition-all hover:scale-110"
                aria-label="Github"
              >
                <Github className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10  rounded-full flex items-center justify-center  transition-all hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10  rounded-full flex items-center justify-center  transition-all hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10  rounded-full flex items-center justify-center  transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-bold ">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className=" hover:text-white transition-colors text-xs sm:text-sm flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5  group-hover:w-3 sm:group-hover:w-4 transition-all"></span>
                  Trang chủ
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className=" hover:text-white transition-colors text-xs sm:text-sm flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5  group-hover:w-3 sm:group-hover:w-4 transition-all"></span>
                  Về tôi
                </a>
              </li>
              <li>
                <a
                  href="/project"
                  className=" hover:text-white transition-colors text-xs sm:text-sm flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5  group-hover:w-3 sm:group-hover:w-4 transition-all"></span>
                  Dự án
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className=" hover:text-white transition-colors text-xs sm:text-sm flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5  group-hover:w-3 sm:group-hover:w-4 transition-all"></span>
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-bold ">Dịch vụ</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/services/web"
                  className=" hover:text-white transition-colors text-xs sm:text-sm flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5  group-hover:w-3 sm:group-hover:w-4 transition-all"></span>
                  Phát triển web
                </a>
              </li>

              <li>
                <a
                  href="/services/ui"
                  className=" hover:text-white transition-colors text-xs sm:text-sm flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5  group-hover:w-3 sm:group-hover:w-4 transition-all"></span>
                  Thiết kế UI/UX
                </a>
              </li>
              <li>
                <a
                  href="/services/consulting"
                  className=" hover:text-white transition-colors text-xs sm:text-sm flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5  group-hover:w-3 sm:group-hover:w-4 transition-all"></span>
                  Tư vấn
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg sm:text-xl font-bold ">Luôn kết nối</h3>
            <p className=" text-xs sm:text-sm">
              Nhận thông tin cập nhật về các dự án mới và bài viết công nghệ.
            </p>
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 sm:px-4 py-2 rounded-lg  border  text-white placeholder-purple-300 focus:outline-none border text-xs sm:text-sm"
              />
              <button className="px-4 sm:px-6 py-2   rounded-lg font-semibold transition-colors text-xs sm:text-sm whitespace-nowrap">
                Liên hệ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className=" text-xs sm:text-sm flex items-center gap-1 text-center sm:text-left">
              © {currentYear} Made with{" "}
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 fill-current" />{" "}
              by Truong
            </p>
            <div className="flex items-center gap-4">
              <a
                href="/privacy"
                className=" hover:text-white transition-colors text-xs sm:text-sm"
              >
                Chính sách bảo mật
              </a>
              <a
                href="/terms"
                className=" hover:text-white transition-colors text-xs sm:text-sm"
              >
                Điều khoản
              </a>
              <button
                onClick={scrollToTop}
                className="w-9 h-9 sm:w-10 sm:h-10  rounded-full flex items-center justify-center  transition-all hover:scale-110"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
