import { AlertCircle } from "lucide-react";
import PropTypes from "prop-types";
export const ErrorDisplay = ({
  title = "Lỗi tải dữ liệu",
  message,
  onRetry,
}) => {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 max-w-md">
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className="text-red-400 flex-shrink-0" size={24} />
          <div>
            <p className="text-red-400 mb-2 font-semibold">{title}</p>
            <p className="text-gray-400">{message}</p>
          </div>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
          >
            Thử lại
          </button>
        )}
      </div>
    </div>
  );
};

ErrorDisplay.propTypes = {
  message: PropTypes.string,
  title: PropTypes.string,
  onRetry: PropTypes.func,
};
