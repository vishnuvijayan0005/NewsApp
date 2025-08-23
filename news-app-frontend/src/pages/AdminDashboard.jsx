import { useEffect, useState } from "react";
import React from "react";
import api from "../api/client.js";
import {
  Home,
  Users,
  FileText,
  ClipboardList,
  UserPlus,
  RefreshCcw,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react"; // ✅ icons

import ManageReporter from "../components/ManageReporter.jsx";
import ManageNews from "../components/ManageNews.jsx";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("sync");
  const [toast, setToast] = useState({ message: "", type: "" });
  const [articles, setArticles] = useState([]);
  // State for all tabs

  const [reporters, setReporters] = useState([]);
  const [newReporter, setNewReporter] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [approvalRequests, setApprovalRequests] = useState([]);
  const [pendingReporters, setPendingReporters] = useState([]);
  const [adminMessages, setAdminMessages] = useState({});

  useEffect(() => {
    fetchArticles();
    fetchReporters();
    fetchApprovalRequests();
    fetchPendingReporters();
  }, []);

  // Toast helper
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const fetchReporters = async () => {
    try {
      const { data } = await api.get("/admin/reporters");
      setReporters(data);
    } catch (err) {
      console.error("Error fetching reporters:", err);
    }
  };

  const fetchPendingReporters = async () => {
    try {
      const { data } = await api.get("/admin/pending-reporters");
      setPendingReporters(data);
    } catch (err) {
      console.error("Error fetching pending reporters:", err);
    }
  };

  const fetchApprovalRequests = async () => {
    try {
      const { data } = await api.get("/approval-requests/");
      setApprovalRequests(data);
    } catch (err) {
      console.error("Error fetching approval requests:", err);
    }
  };
  // API call to fetch articles
  const fetchArticles = async () => {
    try {
      const { data } = await api.get("/admin/news");
      setArticles(data);
    } catch (err) {
      console.error("Error fetching articles:", err);
    }
  };
  // Actions
  const handleSyncNews = async () => {
    try {
      const { data } = await api.post("/articles/sync-serapi-all");
      showToast(
        data.message || `✅ Synced ${data.count || data.total} articles!`,
        "success"
      );
      fetchArticles();
    } catch (err) {
      console.error("Sync error:", err);
      showToast(
        err.response?.data?.message || "❌ Failed to sync news",
        "error"
      );
    }
  };

  const handleAddReporter = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/admin/reporters", newReporter);
      setNewReporter({ name: "", email: "", password: "" });
      fetchReporters();
      showToast(data.message || "Reporter added successfully!");
    } catch (err) {
      console.error("Add reporter error:", err);
      showToast(
        err.response?.data?.message || "Failed to add reporter",
        "error"
      );
    }
  };

  const handleApproval = async (id, status) => {
    const adminMessage = adminMessages[id] || "";
    try {
      await api.patch(`/approval-requests/${id}`, { status, adminMessage });
      fetchApprovalRequests();
      fetchArticles();
      setAdminMessages((prev) => ({ ...prev, [id]: "" }));
      showToast(
        `Request ${status}`,
        status === "approved" ? "success" : "error"
      );
    } catch (err) {
      console.error("Approval error:", err);
    }
  };

  const handlePendingReporter = async (id, status) => {
    try {
      await api.patch(`/admin/approve-reporter/${id}`, { status });
      fetchPendingReporters();
      fetchReporters();
      showToast(
        `Reporter ${status === "approved" ? "approved ✅" : "rejected ❌"}`
      );
    } catch (err) {
      console.error("Pending reporter approval error:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg p-4">
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          Admin Panel
        </h2>
        <nav className="flex flex-col gap-3">
          {[
            { id: "sync", label: "Sync News", icon: <RefreshCcw size={18} /> },
            {
              id: "add-reporter",
              label: "Add Reporter",
              icon: <UserPlus size={18} />,
            },
            {
              id: "manage-reporters",
              label: "Manage Reporters",
              icon: <Users size={18} />,
            },
            {
              id: "manage-news",
              label: "Manage News",
              icon: <FileText size={18} />,
            },
            {
              id: "approvals",
              label: "Approval Requests",
              icon: <ClipboardList size={18} />,
            },
            {
              id: "pending-reporters",
              label: "Pending Reporters",
              icon: <Users size={18} />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          {activeTab.replace("-", " ").toUpperCase()}
        </h1>

        {/* Toast */}
        {toast.message && (
          <div
            className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg ${
              toast.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {toast.message}
          </div>
        )}

        {/* SYNC */}
        {activeTab === "sync" && (
          <div className="flex justify-center">
            <button
              onClick={handleSyncNews}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
            >
              <RefreshCcw size={18} /> Sync News
            </button>
          </div>
        )}

        {/* ADD REPORTER */}
        {activeTab === "add-reporter" && (
          <form className="max-w-md space-y-4" onSubmit={handleAddReporter}>
            <input
              type="text"
              placeholder="Name"
              value={newReporter.name}
              onChange={(e) =>
                setNewReporter({ ...newReporter, name: e.target.value })
              }
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newReporter.email}
              onChange={(e) =>
                setNewReporter({ ...newReporter, email: e.target.value })
              }
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newReporter.password}
              onChange={(e) =>
                setNewReporter({ ...newReporter, password: e.target.value })
              }
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
              required
            />
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg">
              Add Reporter
            </button>
          </form>
        )}

        {/* MANAGE REPORTERS */}
        {activeTab === "manage-reporters" && (
          <ManageReporter articles={articles} fetchArticles={fetchArticles} />
        )}

        {/* Pending Reporters */}
        {activeTab === "pending-reporters" && (
          <div className="grid md:grid-cols-2 gap-4">
            {pendingReporters.map((rep) => (
              <div
                key={rep._id}
                className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{rep.name}</p>
                  <p className="text-sm text-gray-500">{rep.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePendingReporter(rep._id, "approved")}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                  >
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button
                    onClick={() => handlePendingReporter(rep._id, "rejected")}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MANAGE NEWS */}
        {activeTab === "manage-news" && <ManageNews articles={articles} />}

        {/* APPROVAL REQUESTS */}
        {activeTab === "approvals" && (
          <div className="max-w-3xl space-y-4">
            {approvalRequests.length === 0 && <p>No pending requests</p>}
            {approvalRequests.map((req) => (
              <div
                key={req._id}
                className="flex flex-col md:flex-row justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-lg items-start md:items-center"
              >
                <div className="flex-1">
                  <h3>{req.articleData.title}</h3>
                  <p>
                    Reporter: {req.reporter.name} ({req.reporter.email})
                  </p>
                  <p>Category: {req.articleData.category}</p>
                  {req.articleData.imageUrl && (
                    <img
                      src={req.articleData.imageUrl}
                      alt="Article"
                      className="w-32 h-24 object-cover rounded-lg mt-2 md:mt-0 md:ml-4"
                    />
                  )}
                </div>
                {req.status === "pending" && (
                  <div className="flex flex-col gap-2 mt-2 md:mt-0">
                    <input
                      type="text"
                      placeholder="Admin message"
                      value={adminMessages[req._id] || ""}
                      onChange={(e) =>
                        setAdminMessages((prev) => ({
                          ...prev,
                          [req._id]: e.target.value,
                        }))
                      }
                      className="p-2 border rounded-lg dark:bg-gray-600 dark:text-white"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproval(req._id, "approved")}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproval(req._id, "rejected")}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}
                {req.status !== "pending" && req.adminMessage && (
                  <p className="mt-1">Admin Message: {req.adminMessage}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
