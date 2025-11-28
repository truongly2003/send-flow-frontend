import PropTypes from "prop-types";
function LoadingModal({ isProcessing }) {
  if (!isProcessing) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg text-center shadow-lg max-w-sm w-full animate__animated animate__fadeIn">
        {/* Spinner */}
        <div className="flex justify-center mb-4">
          <div className="border-t-4 border-blue-500 border-solid w-12 h-12 rounded-full animate-spin"></div>
        </div>
        <p className="text-lg font-semibold text-gray-700">Đang xử lý...</p>
      </div>
    </div>
  );
}
LoadingModal.propTypes = {
  isProcessing: PropTypes.bool,
};
export default LoadingModal;
