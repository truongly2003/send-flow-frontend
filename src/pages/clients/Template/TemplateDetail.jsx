import { Mail, MessageSquare } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
const TemplateDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const template = location.state?.template;
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center  justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Xem trước template</h1>
            <p className="text-gray-400 text-xl">{template.name}</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          {/* Preview Header */}
          <div className="bg-gray-800/50 px-6 py-4 border-b border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              {template.category === "EMAIL" ? (
                <Mail className="text-blue-400" size={20} />
              ) : (
                <MessageSquare className="text-blue-400" size={20} />
              )}
              <span className="text-sm text-gray-400">
                {template.category === "EMAIL" ? "Email" : "Zalo"}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Subject: </span>
              <span className="font-medium">{template.subject}</span>
            </div>
          </div>

          {/* Preview Body */}
          <div className="p-6">
            <div className="bg-white text-gray-900 rounded-lg p-6 min-h-[300px]">
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {template.body
                  .replace("{name}", "Khách hàng")
                  .replace("{email}", "customer@example.com")
                  .replace("{phone}", "0901234567")}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TemplateDetail;
