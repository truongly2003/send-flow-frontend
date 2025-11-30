import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Package,
  Check,
  X,
  Mail,
  Users,
  Calendar,
  ChevronRight,
  Target,
  Settings,
  UsersIcon,
} from "lucide-react";
import { planApi } from "@services/planApi";
import { subscriptionApi } from "@services/subscriptionApi";
import { LoadingSpinner } from "@components/LoadingSpinner";
// import { ErrorDisplay } from "@components/ErrorDisplay";
import { formatVNDate } from "@configs/formatVNDate";
import { useAuth } from "@/contexts/AuthContext";
function Plan() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await planApi.getAllPlan();
      if (response.code === 2000) {
        setPlans(response.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const { userId } = useAuth();
  const [currentSubscription, setCurrentSubscription] = useState(null);

  const fetchCurrentSubscription = async () => {
    try {
      const response = await subscriptionApi.getSubscriptionByUserId(userId);
      if (response.code === 2000) {
        setCurrentSubscription(response.data);
      }
      // setCurrentSubscription(null)
    } catch (err) {
      console.log(err);
      console.log("dfd");
    }
  };
  useEffect(() => {
    fetchPlans();
    fetchCurrentSubscription();
  }, [userId]);

  const handleSelectPackage = (plan) => {
    navigate(`/payment?planId=${plan.id}`, { state: { plan } });
  };

  const getPeriodText = (period) => {
    const periods = {
      LIFETIME: "Trọn đời",
      MONTHLY: "/tháng",
      YEARLY: "/năm",
      QUARTERLY: "/quý",
    };
    return periods[period] || "";
  };

  if (loading) {
    return <LoadingSpinner message="Đang tải gói dịch vụ..." />;
  }

  // if (error) {
  //   return (
  //     <ErrorDisplay message={error} onRetry={() => window.location.reload()} />
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Chọn gói dịch vụ phù hợp</h1>
          <p className="text-gray-400 text-lg">
            Nâng cấp để mở khóa nhiều tính năng hơn
          </p>
        </div>

        {/* Current Subscription Info */}
        {currentSubscription && currentSubscription.status === "ACTIVE" && (
          <div className="bg-gradient-to-r from-green-900/20 to-green-800/10 border border-green-500/20 rounded-xl p-6 mb-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-green-400/10 p-3 rounded-lg">
                  <Package className="text-green-400" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Gói hiện tại</p>
                  <p className="text-2xl font-bold text-green-400">
                    {currentSubscription.planName}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 mb-1">Hết hạn</p>
                <p className="text-lg font-semibold flex items-center gap-2">
                  <Calendar size={18} />
                  {/* {currentSubscription.endTime} */}
                  {formatVNDate(currentSubscription.endTime)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => {
            let isCurrent;
            if (currentSubscription === null) {
              isCurrent = false;
            } else {
              isCurrent = currentSubscription.planId === plan.id;
            }

            return (
              <div
                key={index}
                className={`relative bg-gradient-to-b  border rounded-2xl p-8 ring-2 ring-purple-500/50 scale-105 transition-all hover:scale-105`}
              >
                {/* Current Badge */}
                {isCurrent && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-400/10 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                      Đang dùng
                    </div>
                  </div>
                )}

                {/* Package Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex p-4 rounded-2xl  mb-4`}>
                    {/* <Icon size={32} /> */}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold">
                      {plan.price.toLocaleString("vi-VN")}
                    </span>
                    <span className="text-gray-400">đ</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {getPeriodText(plan.period)}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <Check
                      className="text-green-400 flex-shrink-0 mt-0.5"
                      size={18}
                    />
                    <span className="text-sm text-gray-300">
                      {plan.maxEmailsPerMonth.toLocaleString()} email/tháng
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check
                      className="text-green-400 flex-shrink-0 mt-0.5"
                      size={18}
                    />
                    <span className="text-sm text-gray-300">
                      {plan.maxContacts.toLocaleString()} liên hệ
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check
                      className="text-green-400 flex-shrink-0 mt-0.5"
                      size={18}
                    />
                    <span className="text-sm text-gray-300">
                      {plan.maxCampaignsPerMonth.toLocaleString()} chiến
                      dịch/tháng
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check
                      className="text-green-400 flex-shrink-0 mt-0.5"
                      size={18}
                    />
                    <span className="text-sm text-gray-300">
                      {plan.maxTemplates.toLocaleString()} mẫu email
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check
                      className="text-green-400 flex-shrink-0 mt-0.5"
                      size={18}
                    />

                    <span
                      className={`text-sm ${
                        plan.allowSmtpCustom ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      SMTP tùy chỉnh
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check
                      className="text-green-400 flex-shrink-0 mt-0.5"
                      size={18}
                    />
                    <span className="text-sm text-gray-300">
                      {plan.allowTeamMembers} thành viên nhóm
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPackage(plan)}
                  disabled={isCurrent}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    isCurrent
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {isCurrent ? (
                    "Gói hiện tại"
                  ) : (
                    <>
                      Mua
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Features Comparison */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            So sánh tính năng
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">
                    Tính năng
                  </th>
                  {plans.map((pkg) => (
                    <th key={pkg.id} className="text-center py-4 px-4">
                      <div className="font-bold">{pkg.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4 flex items-center gap-2">
                    <Mail size={18} className="text-gray-400" />
                    <span>Email/tháng</span>
                  </td>
                  {plans.map((pkg, idx) => (
                    <td
                      key={pkg.id}
                      className={`text-center py-4 px-4 ${
                        idx === 1
                          ? "text-purple-400 font-semibold"
                          : idx === 2
                          ? "text-orange-400 font-semibold"
                          : ""
                      }`}
                    >
                      {pkg.maxEmailsPerMonth.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4 flex items-center gap-2">
                    <Users size={18} className="text-gray-400" />
                    <span>Liên hệ</span>
                  </td>
                  {plans.map((pkg, idx) => (
                    <td
                      key={pkg.id}
                      className={`text-center py-4 px-4 ${
                        idx === 1
                          ? "text-purple-400 font-semibold"
                          : idx === 2
                          ? "text-orange-400 font-semibold"
                          : ""
                      }`}
                    >
                      {pkg.maxContacts.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4 flex items-center gap-2">
                    <Target size={18} className="text-gray-400" />
                    <span>Chiến dịch/tháng</span>
                  </td>
                  {plans.map((pkg, idx) => (
                    <td
                      key={pkg.id}
                      className={`text-center py-4 px-4 ${
                        idx === 1
                          ? "text-purple-400 font-semibold"
                          : idx === 2
                          ? "text-orange-400 font-semibold"
                          : ""
                      }`}
                    >
                      {pkg.maxCampaignsPerMonth.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4 flex items-center gap-2">
                    <Settings size={18} className="text-gray-400" />
                    <span>SMTP tùy chỉnh</span>
                  </td>
                  {plans.map((pkg) => (
                    <td key={pkg.id} className="text-center py-4 px-4">
                      {pkg.allowSmtpCustom ? (
                        <Check className="text-green-400 inline" size={20} />
                      ) : (
                        <X className="text-gray-600 inline" size={20} />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-4 flex items-center gap-2">
                    <UsersIcon size={18} className="text-gray-400" />
                    <span>Thành viên nhóm</span>
                  </td>
                  {plans.map((pkg, idx) => (
                    <td
                      key={pkg.id}
                      className={`text-center py-4 px-4 ${
                        idx === 1
                          ? "text-purple-400 font-semibold"
                          : idx === 2
                          ? "text-orange-400 font-semibold"
                          : ""
                      }`}
                    >
                      {pkg.allowTeamMembers}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>
            Nếu bạn có câu hỏi? Liên hệ với chúng tôi qua email:
            truonglykhong2003@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
}

export default Plan;
