import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
  status: { type: String, enum: ["active", "trial", "paused", "cancelled", "expired"], default: "active" },
  startDate: { type: Date, default: Date.now },
  renewalDate: { type: Date, required: true },
  demo: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Subscription", subscriptionSchema);
