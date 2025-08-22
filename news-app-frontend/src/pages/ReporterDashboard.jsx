import { useState, useEffect } from "react";
import api from "../api/client.js";
import React from "react";

export default function ReporterDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [imageBase64, setImageBase64] = useState(null);
  const [preview, setPreview] = useState(null);

  const [message, setMessage] = useState(null);
  const [type, setType] = useState("");

  const [submissions, setSubmissions] = useState([]);

  // Convert file → Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result); // Base64 string
      setPreview(reader.result); // preview
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

      // Send as JSON with Base64 in `imageUrl`
      await api.post(
        "/approval-requests",
        {
          title,
          description,
          category,
          imageUrl: imageBase64, // match Article & ApprovalRequest field
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to submit article.");
      setType("error");
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Reporter Dashboard
      </h1>

      {message && (
        <div
          className={`p-3 mb-4 rounded-lg text-center font-semibold ${
            type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Article Submission Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 max-w-lg mx-auto space-y-4 mb-8"
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-4">
          Submit Article for Approval
        </h2>

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

        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg"
          />
        )}

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
          Submit for Approval
        </button>
      </form>

      {/* My Submissions */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          My Submissions
        </h2>

        {submissions.length === 0 && (
          <p className="text-gray-700 dark:text-gray-300">
            No submissions yet.
          </p>
        )}

        <div className="space-y-4">
          {submissions.map((sub) => (
            <div
              key={sub._id}
              className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col md:flex-row md:justify-between items-start md:items-center"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {sub.articleData.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Category: {sub.articleData.category}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Status:{" "}
                  <span
                    className={
                      sub.status === "approved"
                        ? "text-green-600"
                        : sub.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }
                  >
                    {sub.status.toUpperCase()}
                  </span>
                </p>
                {sub.adminMessage && (
                  <p className="text-gray-700 dark:text-gray-300">
                    Admin Message: {sub.adminMessage}
                  </p>
                )}
              </div>
              {sub.articleData.imageUrl && (
                <img
                  src={sub.articleData.imageUrl}
                  alt="Article"
                  className="w-32 h-24 object-cover rounded-lg mt-2 md:mt-0 md:ml-4"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
