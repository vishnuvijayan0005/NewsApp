import { useState, useEffect } from "react";
import api from "../api/client.js";
import React from "react";
import { motion } from "framer-motion";

export default function ReporterDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [imageBase64, setImageBase64] = useState(null);
  const [preview, setPreview] = useState(null);

  const [message, setMessage] = useState(null);
  const [type, setType] = useState("");

  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState("submit");

  // Convert file → Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Fetch reporter's submissions
  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/approval-requests/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Submit article for approval
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/approval-requests",
        {
          title,
          description,
          category,
          imageUrl: imageBase64,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("✅ Article submitted for approval!");
      setType("success");

      setTitle("");
      setDescription("");
      setCategory("general");
      setImageBase64(null);
      setPreview(null);

      fetchSubmissions();
      setActiveTab("submissions");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to submit article.");
      setType("error");
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        Reporter Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex justify-center mb-6 border-b border-gray-300 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("submit")}
          className={`px-6 py-2 font-semibold transition ${
            activeTab === "submit"
              ? "border-b-4 border-blue-600 text-blue-600"
              : "text-gray-600 dark:text-gray-300 hover:text-blue-600"
          }`}
        >
          Submit News
        </button>
        <button
          onClick={() => setActiveTab("submissions")}
          className={`px-6 py-2 font-semibold transition ${
            activeTab === "submissions"
              ? "border-b-4 border-blue-600 text-blue-600"
              : "text-gray-600 dark:text-gray-300 hover:text-blue-600"
          }`}
        >
          My Submissions
        </button>
      </div>

      {/* Message Box */}
      {message && (
        <div
          className={`p-3 mb-4 rounded-lg text-center font-semibold max-w-lg mx-auto ${
            type === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {message}
        </div>
      )}

      {/* Tabs Content */}
      {activeTab === "submit" && (
        <motion.div
          key="submit"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 max-w-lg mx-auto"
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-4">
            Submit Article for Approval
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
              required
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
              required
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            >
              <option value="general">General</option>
              <option value="politics">Politics</option>
              <option value="sports">Sports</option>
              <option value="tech">Tech</option>
              <option value="business">Business</option>
              <option value="health">Health</option>
            </select>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg border"
              />
            )}

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
              Submit for Approval
            </button>
          </form>
        </motion.div>
      )}

      {activeTab === "submissions" && (
        <motion.div
          key="submissions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
            My Submissions
          </h2>

          {submissions.length === 0 ? (
            <p className="text-center text-gray-700 dark:text-gray-300">
              No submissions yet.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {submissions.map((sub) => (
                <div
                  key={sub._id}
                  className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col"
                >
                  {sub.articleData.imageUrl && (
                    <img
                      src={sub.articleData.imageUrl}
                      alt="Article"
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {sub.articleData.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {sub.articleData.category}
                  </p>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    Status:{" "}
                    <span
                      className={
                        sub.status === "approved"
                          ? "text-green-600 font-semibold"
                          : sub.status === "rejected"
                          ? "text-red-600 font-semibold"
                          : "text-yellow-600 font-semibold"
                      }
                    >
                      {sub.status.toUpperCase()}
                    </span>
                  </p>
                  {sub.adminMessage && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Admin: {sub.adminMessage}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
