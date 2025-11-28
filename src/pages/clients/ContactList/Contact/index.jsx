import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Upload,
  Download,
  Trash2,
  Edit,
  Users,
  Mail,
  Phone,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { contactApi } from "@services/contactApi";

import { LoadingSpinner } from "@components/LoadingSpinner";
import { ErrorDisplay } from "@components/ErrorDisplay";
function Contact() {
  const navigate = useNavigate();
  const location = useLocation();
  const list = location.state?.list;
  const [showImportModal, setShowImportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(0);
  const size = 10;
  const [totalPages, setTotalPages] = useState(0);

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingContact, setEditingContact] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const fetchContact = async () => {
    try {
      setLoading(true);
      const response = await contactApi.getAllContact(list.id, page, size);
      if (response.code === 2000) {
        setContacts(response.data.content);
        setTotalPages(response.data.totalPages);
      } else {
        setError("Failed to fetch plans");
      }
    } catch (err) {
      setError("Error fetching plans: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchContact();
  }, [list.id, page, size]);

  const handleDeleteContact = async (id) => {
    if (confirm("Bạn có chắc muốn xóa liên hệ này?")) {
      try {
        setLoading(true);
        const response = await contactApi.deleteContact(id);
        if (response.code === 2000) {
          setContacts(contacts.filter((contact) => contact.id !== id));
          alert(response.message);
        } else {
          alert(response.message);
        }
      } catch (err) {
        alert("Lỗi khi xóa liên hệ: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const handleOpenAddModal = () => {
    setEditingContact(null);
    setContactForm({ name: "", phone: "", email: "" });
    setShowContactModal(true);
  };
  const handleOpenEditModal = (contact) => {
    setEditingContact(contact);
    setContactForm({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
    });
    setShowContactModal(true);
  };
  const handleSaveContact = async () => {
    if (!contactForm.name || !contactForm.phone || !contactForm.email) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      const contactData = {
        name: contactForm.name,
        phone: contactForm.phone,
        email: contactForm.email,
        contactListId: list.id,
      };

      let response;
      if (editingContact) {
        // Update existing contact
        response = await contactApi.updateContact(
          editingContact.id,
          contactData
        );
      } else {
        // Create new contact
        response = await contactApi.createContact(contactData);
      }

      if (response.code === 2000) {
        alert(response.message);
        setContactForm({ name: "", phone: "", email: "" });
        setShowContactModal(false);
        setEditingContact(null);
        fetchContact();
      }
    } catch (err) {
      alert(
        "Lỗi khi " +
          (editingContact ? "cập nhật" : "thêm") +
          " liên hệ: " +
          err.message
      );
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.contactListId === list?.id &&
      (contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Importing CSV:", file.name);
      // Xử lý import CSV ở đây
      setShowImportModal(false);
    }
  };

  const handleExportCSV = () => {
    const listContacts = contacts.filter((c) => c.listId === list.id);
    const csvContent =
      "Name,Phone,Email\n" +
      listContacts.map((c) => `${c.name},${c.phone},${c.email}`).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${list.name}_contacts.csv`;
    a.click();
  };

  if (loading) {
    return <LoadingSpinner message="Đang tải gói danh sách liên hệ..." />;
  }

  if (error) {
    return (
      <ErrorDisplay message={error} onRetry={() => window.location.reload()} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{list.name}</h1>
            <p className="text-gray-400">{list.description}</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Quay lại
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Users className="text-blue-400" size={20} />
              <span className="text-sm text-gray-400">Tổng liên hệ</span>
            </div>
            <p className="text-3xl font-bold">{contacts?.length}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="text-green-400" size={20} />
              <span className="text-sm text-gray-400">Email hợp lệ</span>
            </div>
            <p className="text-3xl font-bold">{contacts?.length}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="text-purple-400" size={20} />
              <span className="text-sm text-gray-400">SĐT hợp lệ</span>
            </div>
            <p className="text-3xl font-bold">{contacts?.length}</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Thêm liên hệ
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Upload size={18} />
                Import CSV
              </button>
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <Download size={18} />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                  Tên
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                  Số điện thoại
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                  Email
                </th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="border-t border-gray-800 hover:bg-gray-800/30"
                >
                  <td className="px-6 py-4">{contact.name}</td>
                  <td className="px-6 py-4 text-gray-400">{contact.phone}</td>
                  <td className="px-6 py-4 text-gray-400">{contact.email}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(contact)}
                        className="p-2 text-blue-400 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteContact(contact.id)}
                        className="p-2 text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredContacts.length === 0 && (
            <div className="p-12 text-center">
              <Users className="mx-auto mb-4 text-gray-600" size={48} />
              <p className="text-gray-400">Chưa có liên hệ nào</p>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50"
          >
            Trang trước
          </button>
          <span>
            Trang {page + 1} / {totalPages}
          </span>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50"
          >
            Trang sau
          </button>
        </div>
      </div>
      {/* Add Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {" "}
                {editingContact ? "Chỉnh sửa liên hệ" : "Thêm liên hệ mới"}
              </h2>
              <button
                onClick={() => {
                  setShowContactModal(false);
                  setEditingContact(null);
                  setContactForm({ name: "", phone: "", email: "" });
                }}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tên</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, name: e.target.value })
                  }
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, phone: e.target.value })
                  }
                  placeholder="0901234567"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, email: e.target.value })
                  }
                  placeholder="email@example.com"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={handleSaveContact}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
              >
                {editingContact ? "Cập nhật liên hệ" : "Thêm liên hệ"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import CSV Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Import CSV</h2>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4 text-sm text-gray-400">
                <p className="mb-2">File CSV phải có định dạng:</p>
                <code className="text-blue-400">Name,Phone,Email</code>
              </div>

              <label className="block">
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors">
                  <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-sm text-gray-400">
                    Click để chọn file CSV
                  </p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleImportCSV}
                    className="hidden"
                  />
                </div>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contact;
