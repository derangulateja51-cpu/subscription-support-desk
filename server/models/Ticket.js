import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  ticketNumber: { type: String, unique: true, index: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  subject: { type: String, required: true, trim: true, maxlength: 160 },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
  category: { type: String, enum: ["billing", "subscription", "technical", "account", "other"], default: "other" },
  priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
  status: { type: String, enum: ["open", "in_progress", "waiting_customer", "resolved", "closed"], default: "open" }
}, { timestamps: true });

ticketSchema.pre("validate", function(next) {
  if (!this.ticketNumber) this.ticketNumber = `SD-${Date.now().toString().slice(-8)}-${Math.floor(Math.random()*90+10)}`;
  next();
});

export default mongoose.model("Ticket", ticketSchema);
