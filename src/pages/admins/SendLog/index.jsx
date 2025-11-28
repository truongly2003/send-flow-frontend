import { useState, useEffect } from 'react';
import { Search, Mail, CheckCircle, XCircle, Eye, Filter } from 'lucide-react';

function SendLog() {
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const mockLogs = [
      {
        id: 'LOG001',
        userId: 1,
        userName: 'John Doe',
        campaignId: 'CAMP001',
        campaignName: 'Black Friday Sale 2025',
        provider: 'SendGrid',
        emailsSent: 5000,
        emailsFailed: 12,
        successRate: 99.76,
        sentAt: '2025-10-28 14:30:00',
        status: 'completed',
        providerResponse: {
          status: 'success',
          messageId: 'SG-ABC123XYZ',
          acceptedCount: 5000,
          rejectedCount: 12,
          rejectedReasons: ['Invalid email: 8', 'Bounced: 4']
        }
      },
      {
        id: 'LOG002',
        userId: 2,
        userName: 'Admin User',
        campaignId: 'CAMP002',
        campaignName: 'Product Launch Newsletter',
        provider: 'AWS SES',
        emailsSent: 10000,
        emailsFailed: 0,
        successRate: 100,
        sentAt: '2025-10-29 10:15:00',
        status: 'completed',
        providerResponse: {
          status: 'success',
          messageId: 'AWS-DEF456ABC',
          acceptedCount: 10000,
          rejectedCount: 0
        }
      },
      {
        id: 'LOG003',
        userId: 3,
        userName: 'Jane Smith',
        campaignId: 'CAMP003',
        campaignName: 'Weekly Newsletter #42',
        provider: 'SendGrid',
        emailsSent: 850,
        emailsFailed: 150,
        successRate: 85.0,
        sentAt: '2025-10-29 16:45:00',
        status: 'completed',
        providerResponse: {
          status: 'partial_success',
          messageId: 'SG-GHI789DEF',
          acceptedCount: 850,
          rejectedCount: 150,
          rejectedReasons: ['Invalid email: 100', 'Rate limit exceeded: 50']
        }
      },
      {
        id: 'LOG004',
        userId: 4,
        userName: 'Marketing Team',
        campaignId: 'CAMP004',
        campaignName: 'Flash Sale Alert',
        provider: 'Mailgun',
        emailsSent: 0,
        emailsFailed: 3000,
        successRate: 0,
        sentAt: '2025-10-30 09:20:00',
        status: 'failed',
        providerResponse: {
          status: 'error',
          errorCode: 'AUTH_FAILED',
          errorMessage: 'Invalid API credentials',
          rejectedCount: 3000
        }
      },
      {
        id: 'LOG005',
        userId: 1,
        userName: 'John Doe',
        campaignId: 'CAMP005',
        campaignName: 'Monthly Report October',
        provider: 'SendGrid',
        emailsSent: 2500,
        emailsFailed: 25,
        successRate: 99.0,
        sentAt: '2025-10-27 11:00:00',
        status: 'completed',
        providerResponse: {
          status: 'success',
          messageId: 'SG-JKL012MNO',
          acceptedCount: 2500,
          rejectedCount: 25,
          rejectedReasons: ['Spam complaint: 15', 'Invalid email: 10']
        }
      }
    ];
    setLogs(mockLogs);
  }, []);

  const handleViewDetail = (log) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  const filteredLogs = logs.filter(log => {
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    const matchesSearch = 
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.campaignName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalEmailsSent = logs.reduce((sum, log) => sum + log.emailsSent, 0);
  const totalEmailsFailed = logs.reduce((sum, log) => sum + log.emailsFailed, 0);
  const overallSuccessRate = totalEmailsSent > 0 
    ? ((totalEmailsSent / (totalEmailsSent + totalEmailsFailed)) * 100).toFixed(2)
    : 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Send Logs</h1>
          <p className="text-gray-400">Xem campaign/send log và debug provider response</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="text-blue-400" size={24} />
              <span className="text-gray-400 text-sm">Total Campaigns</span>
            </div>
            <p className="text-2xl font-bold text-white">{logs.length}</p>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="text-green-400" size={24} />
              <span className="text-gray-400 text-sm">Emails Sent</span>
            </div>
            <p className="text-2xl font-bold text-white">{totalEmailsSent.toLocaleString()}</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="text-red-400" size={24} />
              <span className="text-gray-400 text-sm">Emails Failed</span>
            </div>
            <p className="text-2xl font-bold text-white">{totalEmailsFailed.toLocaleString()}</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Filter className="text-purple-400" size={24} />
              <span className="text-gray-400 text-sm">Success Rate</span>
            </div>
            <p className="text-2xl font-bold text-white">{overallSuccessRate}%</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm theo ID, user hoặc campaign name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filterStatus === 'all' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filterStatus === 'completed' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilterStatus('failed')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filterStatus === 'failed' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Failed
              </button>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Log ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Campaign</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Provider</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Stats</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Success Rate</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Sent At</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-mono text-sm text-blue-400">{log.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white">{log.campaignName}</p>
                        <p className="text-xs text-gray-400">{log.campaignId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">{log.userName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-purple-400/10 text-purple-400 rounded-full text-xs font-medium">
                        {log.provider}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-green-400">✓ {log.emailsSent.toLocaleString()} sent</p>
                        <p className="text-red-400">✗ {log.emailsFailed.toLocaleString()} failed</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              log.successRate >= 95 ? 'bg-green-400' : 
                              log.successRate >= 80 ? 'bg-yellow-400' : 'bg-red-400'
                            }`}
                            style={{ width: `${log.successRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{log.successRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-400">{log.sentAt}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => handleViewDetail(log)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                        >
                          <Eye size={14} />
                          Debug
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredLogs.length === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center mt-6">
            <Mail className="mx-auto mb-4 text-gray-600" size={48} />
            <p className="text-gray-400">Không tìm thấy log nào</p>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedLog && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
                <div>
                  <h2 className="text-2xl font-bold text-white">Log Detail & Provider Response</h2>
                  <p className="text-gray-400 text-sm mt-1">{selectedLog.id}</p>
                </div>
                <button 
                  onClick={() => setShowDetailModal(false)} 
                  className="text-gray-400 hover:text-white"
                >
                  <Eye size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Campaign Info */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Campaign Information</h3>
                  <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Campaign Name:</span>
                      <span className="text-white font-medium">{selectedLog.campaignName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Campaign ID:</span>
                      <span className="text-blue-400 font-mono text-sm">{selectedLog.campaignId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">User:</span>
                      <span className="text-white">{selectedLog.userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sent At:</span>
                      <span className="text-white">{selectedLog.sentAt}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Statistics</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-400/10 border border-green-400/20 rounded-lg p-4">
                      <p className="text-green-400 text-sm mb-1">Emails Sent</p>
                      <p className="text-2xl font-bold text-white">{selectedLog.emailsSent.toLocaleString()}</p>
                    </div>
                    <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-4">
                      <p className="text-red-400 text-sm mb-1">Emails Failed</p>
                      <p className="text-2xl font-bold text-white">{selectedLog.emailsFailed.toLocaleString()}</p>
                    </div>
                    <div className="bg-blue-400/10 border border-blue-400/20 rounded-lg p-4">
                      <p className="text-blue-400 text-sm mb-1">Success Rate</p>
                      <p className="text-2xl font-bold text-white">{selectedLog.successRate}%</p>
                    </div>
                  </div>
                </div>

                {/* Provider Response */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Provider Response ({selectedLog.provider})</h3>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <pre className="text-gray-300 text-sm font-mono overflow-x-auto">
                      {JSON.stringify(selectedLog.providerResponse, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Rejected Reasons (if available) */}
                {selectedLog.providerResponse.rejectedReasons && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Rejection Reasons</h3>
                    <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-4">
                      <ul className="space-y-2">
                        {selectedLog.providerResponse.rejectedReasons.map((reason, index) => (
                          <li key={index} className="text-red-400 text-sm flex items-start gap-2">
                            <span>•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-800">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SendLog;