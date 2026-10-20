import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Plan from "./models/Plan.js";
import Subscription from "./models/Subscription.js";
import Ticket from "./models/Ticket.js";
import Message from "./models/Message.js";

async function upsertUser({ name, email, password, role }) {
  return User.findOneAndUpdate(
    { email },
    { $set: { name, email, role, passwordHash: await bcrypt.hash(password, 12) } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

await connectDB();
try {
  const admin = await upsertUser({ name: "Demo Admin", email: "admin@example.com", password: "Admin123!", role: "admin" });
  const agent = await upsertUser({ name: "Demo Agent", email: "agent@example.com", password: "Agent123!", role: "agent" });
  const customer = await upsertUser({ name: "Demo Customer", email: "customer@example.com", password: "Customer123!", role: "customer" });

  const plansData = [
    { name: "Starter", description: "For personal use", price: 199, interval: "monthly", features: ["Basic support", "1 workspace"], active: true },
    { name: "Professional", description: "For growing teams", price: 599, interval: "monthly", features: ["Priority support", "5 workspaces"], active: true },
    { name: "Annual Plus", description: "Annual demo plan", price: 4999, interval: "yearly", features: ["Priority support", "Unlimited workspaces"], active: true }
  ];
  const plans = [];
  for (const data of plansData) plans.push(await Plan.findOneAndUpdate({ name: data.name }, data, { upsert: true, new: true }));

  if (!await Subscription.exists({ user: customer._id })) {
    await Subscription.create({ user: customer._id, plan: plans[1]._id, status: "active", startDate: new Date(), renewalDate: new Date(Date.now() + 30 * 86400000), demo: true });
  }
  if (!await Ticket.exists({ customer: customer._id })) {
    const ticket = await Ticket.create({ customer: customer._id, assignedAgent: agent._id, subject: "How does renewal work?", description: "I would like to understand the demo subscription renewal date.", category: "subscription", priority: "medium", status: "in_progress" });
    await Message.create({ ticket: ticket._id, sender: customer._id, body: "I would like to understand the demo subscription renewal date." });
    await Message.create({ ticket: ticket._id, sender: agent._id, body: "This is demo data. The renewal date is shown in My Subscriptions." });
  }
  console.log("Seed complete. Demo logins:");
  console.log("admin@example.com / Admin123!");
  console.log("agent@example.com / Agent123!");
  console.log("customer@example.com / Customer123!");
} finally {
  await mongoose.disconnect();
}
