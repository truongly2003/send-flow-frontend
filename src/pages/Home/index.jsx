import { Check } from "lucide-react";
import { NavLink } from "react-router-dom";

function Home() {
  const plans = [
    {
      name: "Gói Free",
      price: "0đ",
      priceSuffix: "/tháng",
      features: [
        "100 email mỗi ngày",
        "Template cơ bản",
        "Báo cáo thống kê",
        "Hỗ trợ email",
      ],
      buttonText: "Bắt đầu miễn phí",
      buttonClass:
        "py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-bold transition-all duration-300 border border-gray-700 hover:border-gray-600 text-white",
      cardClass:
        "flex flex-col p-8 bg-gray-800 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-500 h-full",
      featureTextClass: "text-gray-400 text-sm",
      checkClass: "text-gray-500",
      headerClass: "text-white",
    },
    {
      name: "Gói Chuyên Nghiệp",
      price: "499K",
      priceSuffix: "/tháng",
      features: [
        "Không giới hạn email",
        "Template cao cấp + AI",
        "Phân tích chi tiết & A/B test",
        "API tích hợp đầy đủ",
        "Hỗ trợ ưu tiên 24/7",
        "Tự động hóa nâng cao",
      ],
      buttonText: "Đăng ký ngay",
      buttonClass:
        "py-3 bg-white hover:bg-gray-100 rounded-lg font-bold transition-all duration-300 border border-white/20 hover:border-white/40 text-black",
      cardClass:
        "flex flex-col p-8 bg-gray-900 rounded-2xl border-2 border-white/20 relative hover:border-white/40 transition-all duration-500 transform hover:scale-105 shadow-xl shadow-white/10 h-full",
      featureTextClass: (index) =>
        index === 0 ? "text-white font-semibold" : "text-gray-300",
      checkClass: "text-white",
      headerClass: "",
    },
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-white px-10">
      {/* Hero Section */}
      <section className=" px-4 relative overflow-hidden max-w-6xl mx-auto">
        {/* Dark subtle background effects */}
        <div className="absolute inset-0 "></div>
        <div className="relative z-10 text-center mt-40">
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
            <span className="text-white">Gửi Email</span>
          </h1>

          <p className="text-base md:text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Tiếp cận hàng nghìn khách hàng trong tích tắc. Nền tảng email
            marketing mạnh mẽ nhất thị trường.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <NavLink
              to="/login"
              className="px-8 py-3 bg-white text-black rounded-lg font-bold hover:shadow-xl hover:shadow-white/40 transition-all duration-300 transform hover:scale-105"
            >
              Bắt đầu miễn phí
            </NavLink>
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section className="py-16 px-4 relative overflow-hidden max-w-6xl mx-auto mb-8">
        <div className="absolute inset-0 "></div>
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-3">
            Chọn sức mạnh của bạn
          </h2>
          <p className="text-center text-gray-500 mb-12 text-sm">
            Miễn phí hoặc không giới hạn - quyết định thuộc về bạn
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {plans.map((plan, planIndex) => (
              <div key={planIndex} className={plan.cardClass}>
                <div className="mb-6">
                  <h3
                    className={`text-2xl font-black mb-2 ${plan.headerClass}`}
                  >
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-500">{plan.priceSuffix}</span>
                  </div>
                </div>

                <div
                  className={`h-px ${
                    planIndex === 0 ? "bg-gray-800" : "bg-white/20"
                  } mb-6`}
                ></div>

                <ul className="space-y-3 mb-auto">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check
                        className={`${plan.checkClass} flex-shrink-0 mt-0.5`}
                        size={18}
                      />
                      <span
                        className={`text-sm ${
                          typeof plan.featureTextClass === "function"
                            ? plan.featureTextClass(featureIndex)
                            : plan.featureTextClass
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button className={`${plan.buttonClass} mt-4  w-full`}>
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
