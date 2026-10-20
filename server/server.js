import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import subscriptionRoutes from "./routes/subscriptions.js";
import ticketRoutes from "./routes/tickets.js";
import adminRoutes from "./routes/admin.js";
import { configureSocket } from "./socket.js";

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET must be set in .env");

const app = express();
const server = http.createServer(app);
const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const io = new Server(server, { cors: { origin: allowedOrigin, methods: ["GET", "POST", "PATCH"] } });
app.set("io", io);

app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Unexpected server error" });
});

configureSocket(io);
const port = process.env.PORT || 5000;
connectDB().then(() => server.listen(port, () => console.log(`API listening on http://localhost:${port}`)))
  .catch(err => { console.error("Startup failed:", err.message); process.exit(1); });
