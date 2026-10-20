import { Router } from "express";
import User from "../models/User.js";
import Plan from "../models/Plan.js";
import Ticket from "../models/Ticket.js";
import { requireAuth, allowRoles } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth, allowRoles("admin"));

router.get("/overview", async (_req, res) => {
  const [users, agents, tickets, openTickets, plans] = await Promise.all([
    User.countDocuments({ role: "customer" }),
    User.countDocuments({ role: "agent" }),
    Ticket.countDocuments(),
    Ticket.countDocuments({ status: { $in: ["open", "in_progress", "waiting_customer"] } }),
    Plan.find().sort({ price: 1 })
  ]);
  res.json({ counts: { users, agents, tickets, openTickets }, plans });
});

router.get("/users", async (_req, res) => {
  const users = await User.find().select("name email role createdAt").sort({ createdAt: -1 }).limit(200);
  res.json({ users });
});

export default router;
