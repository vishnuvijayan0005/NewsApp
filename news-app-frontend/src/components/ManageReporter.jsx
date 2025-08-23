import React from "react";
import { Trash2 } from "lucide-react";
function ManageReporter({ reporters }) {
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
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {reporters.map((rep) => (
        <div
          key={rep._id}
          className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{rep.name}</p>
            <p className="text-sm text-gray-500">{rep.email}</p>
            <p className="text-sm">Status: {rep.status}</p>
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
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg flex items-center"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ManageReporter;
