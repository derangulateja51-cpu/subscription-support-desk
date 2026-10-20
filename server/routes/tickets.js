import { Router } from "express";
import Ticket from "../models/Ticket.js";
import Message from "../models/Message.js";
import { requireAuth, allowRoles } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

function ticketScope(user) {
  if (user.role === "admin") return {};
  if (user.role === "agent") return { $or: [{ assignedAgent: user._id }, { assignedAgent: null }] };
  return { customer: user._id };
}

router.get("/", async (req, res) => {
  const filter = ticketScope(req.user);
  const tickets = await Ticket.find(filter)
    .populate("customer", "name email")
    .populate("assignedAgent", "name email")
    .sort({ updatedAt: -1 }).limit(100);
  res.json({ tickets });
});

router.post("/", async (req, res) => {
  try {
    const { subject, description, category, priority } = req.body;
    if (!subject?.trim() || !description?.trim()) return res.status(400).json({ message: "Subject and description are required" });
    const ticket = await Ticket.create({
      customer: req.user._id, subject: subject.trim(), description: description.trim(),
      category: ["billing","subscription","technical","account","other"].includes(category) ? category : "other",
      priority: ["low","medium","high","urgent"].includes(priority) ? priority : "medium"
    });
    res.status(201).json({ ticket });
  } catch {
    res.status(500).json({ message: "Could not create ticket" });
  }
});

router.get("/:id", async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate("customer", "name email").populate("assignedAgent", "name email");
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });
  const permitted = req.user.role === "admin" ||
    (req.user.role === "customer" && String(ticket.customer._id) === String(req.user._id)) ||
    (req.user.role === "agent" && (!ticket.assignedAgent || String(ticket.assignedAgent._id) === String(req.user._id)));
  if (!permitted) return res.status(403).json({ message: "No access to this ticket" });
  const messages = await Message.find({ ticket: ticket._id }).populate("sender", "name role").sort({ createdAt: 1 });
  res.json({ ticket, messages });
});

router.post("/:id/messages", async (req, res) => {
  const body = req.body.body?.trim();
  if (!body || body.length > 4000) return res.status(400).json({ message: "Message must be between 1 and 4000 characters" });
  const ticket = await Ticket.findById(req.params.id).populate("customer", "_id");
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });
  const permitted = req.user.role === "admin" ||
    (req.user.role === "customer" && String(ticket.customer._id) === String(req.user._id)) ||
    (req.user.role === "agent" && (!ticket.assignedAgent || String(ticket.assignedAgent) === String(req.user._id)));
  if (!permitted) return res.status(403).json({ message: "No access to this ticket" });
  const message = await Message.create({ ticket: ticket._id, sender: req.user._id, body });
  const populated = await message.populate("sender", "name role");
  req.app.get("io")?.to(`ticket:${ticket._id}`).emit("chat:message", populated);
  res.status(201).json({ message: populated });
});

router.patch("/:id/status", allowRoles("agent", "admin"), async (req, res) => {
  const allowed = ["open", "in_progress", "waiting_customer", "resolved", "closed"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: "Invalid status" });
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });
  if (req.user.role === "agent" && ticket.assignedAgent && String(ticket.assignedAgent) !== String(req.user._id)) {
    return res.status(403).json({ message: "Ticket is assigned to another agent" });
  }
  if (req.user.role === "agent" && !ticket.assignedAgent) ticket.assignedAgent = req.user._id;
  ticket.status = req.body.status;
  await ticket.save();
  res.json({ ticket });
});

export default router;
