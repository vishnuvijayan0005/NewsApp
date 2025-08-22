import { useEffect, useState } from "react";
import React from "react";
import api from "../api/client.js";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("sync");
  const [reporterMessage, setReporterMessage] = useState("");
  const [reporterMessageType, setReporterMessageType] = useState("");
  const [syncMessage, setSyncMessage] = useState("");
  const [syncMessageType, setSyncMessageType] = useState("");

  // State for all tabs
  const [articles, setArticles] = useState([]);
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

  // ➤ Fetch functions
  const fetchArticles = async () => {
    try {
      const { data } = await api.get("/admin/news");
      setArticles(data);
    } catch (err) {
      console.error("Error fetching articles:", err);
    }
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

  // ➤ Sync SerpAPI news
  const handleSyncNews = async () => {
    try {
      const { data } = await api.post("/articles/sync-serapi-all");
      setSyncMessage(
        data.message ||
          `✅ Synced ${data.count || data.total} articles successfully!`
      );
      setSyncMessageType("success");
      fetchArticles();
      setTimeout(() => setSyncMessage(""), 3000);
    } catch (err) {
      console.error("Sync error:", err);
      setSyncMessage(err.response?.data?.message || "❌ Failed to sync news");
      setSyncMessageType("error");
      setTimeout(() => setSyncMessage(""), 3000);
    }
  };

  // ➤ Reporter Management
  const handleAddReporter = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/admin/reporters", newReporter);
      setNewReporter({ name: "", email: "", password: "" });
      fetchReporters();
      setReporterMessage(data.message || "Reporter added successfully!");
      setReporterMessageType("success");
      setTimeout(() => setReporterMessage(""), 3000);
    } catch (err) {
      console.error("Add reporter error:", err);
      setReporterMessage(
        err.response?.data?.message || "Failed to add reporter"
      );
      setReporterMessageType("error");
      setTimeout(() => setReporterMessage(""), 3000);
    }
  };

  const toggleReporter = async (id) => {
    try {
      await api.patch(`/admin/reporters/${id}/toggle`);
      fetchReporters();
    } catch (err) {
      console.error("Toggle reporter error:", err);
    }
  };

  const deleteReporter = async (id) => {
    try {
      await api.delete(`/admin/reporters/${id}`);
      fetchReporters();
    } catch (err) {
      console.error("Delete reporter error:", err);
    }
  };

  // ➤ News management
  const deleteNews = async (id) => {
    try {
      await api.delete(`/admin/news/${id}`);
      fetchArticles();
    } catch (err) {
      console.error("Delete news error:", err);
    }
  };

  // ➤ Approve/Reject requests
  const handleApproval = async (id, status) => {
    const adminMessage = adminMessages[id] || "";
    try {
      await api.patch(`/approval-requests/${id}`, { status, adminMessage });
      fetchApprovalRequests();
      fetchArticles();
      setAdminMessages((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      console.error("Approval error:", err);
    }
  };

  // ➤ Approve/Reject pending reporter registrations
  const handlePendingReporter = async (id, status) => {
    try {
      await api.patch(`/admin/approve-reporter/${id}`, { status });
      fetchPendingReporters();
      fetchReporters();
    } catch (err) {
      console.error("Pending reporter approval error:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen relative">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 overflow-x-auto">
        {[
          { id: "sync", label: "Sync News" },
          { id: "add-reporter", label: "Add Reporter" },
          { id: "manage-reporters", label: "Manage Reporters" },
          { id: "manage-news", label: "Manage News" },
          { id: "approvals", label: "Approval Requests" },
          { id: "pending-reporters", label: "Pending Reporters" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-lg font-semibold transition ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-b-xl p-6">
        {/* SYNC NEWS */}
        {activeTab === "sync" && (
          <div className="text-center">
            <button
              onClick={handleSyncNews}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
            >
              Sync News from SerpAPI
            </button>
            {syncMessage && (
              <p
                className={`mt-4 ${
                  syncMessageType === "success"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {syncMessage}
              </p>
            )}
          </div>
        )}

        {/* ADD REPORTER */}
        {activeTab === "add-reporter" && (
          <form
            className="max-w-md mx-auto space-y-4"
            onSubmit={handleAddReporter}
          >
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
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition">
              Add Reporter
            </button>
          </form>
        )}

        {/* MANAGE REPORTERS */}
        {activeTab === "manage-reporters" && (
          <div className="space-y-4 max-w-3xl mx-auto">
            {reporters.length === 0 && <p>No reporters yet.</p>}
            {reporters.map((rep) => (
              <div
                key={rep._id}
                className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
              >
                <div>
                  <p>
                    {rep.name} ({rep.email})
                  </p>
                  <p>Status: {rep.status}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleReporter(rep._id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg"
                  >
                    {rep.status === "active" ? "Disable" : "Enable"}
                  </button>
                  <button
                    onClick={() => deleteReporter(rep._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PENDING REPORTERS */}
        {activeTab === "pending-reporters" && (
          <div className="space-y-4 max-w-3xl mx-auto">
            {pendingReporters.length === 0 && <p>No pending reporters.</p>}
            {pendingReporters.map((rep) => (
              <div
                key={rep._id}
                className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
              >
                <div>
                  <p>
                    {rep.name} ({rep.email})
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePendingReporter(rep._id, "approved")}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handlePendingReporter(rep._id, "rejected")}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MANAGE NEWS */}
        {activeTab === "manage-news" && (
          <div className="space-y-4 max-w-3xl mx-auto">
            {articles.length === 0 && <p>No articles yet.</p>}
            {articles.map((art) => (
              <div
                key={art._id}
                className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
              >
                <div>
                  <p>{art.title}</p>
                  <p>Category: {art.category}</p>
                  <p>Author: {art.displayAuthor}</p>
                </div>
                <button
                  onClick={() => deleteNews(art._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

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
      </div>
    </div>
  );
}
