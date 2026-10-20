import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true, min: 0 },
  interval: { type: String, enum: ["monthly", "yearly"], default: "monthly" },
  features: [{ type: String }],
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Plan", planSchema);
