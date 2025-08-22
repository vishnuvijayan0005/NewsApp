import mongoose from "mongoose";

const pendingReporterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "reporter" }, // optional but explicit
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("PendingReporter", pendingReporterSchema);
