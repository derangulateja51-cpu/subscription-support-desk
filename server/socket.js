import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Ticket from "./models/Ticket.js";

export function configureSocket(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required"));
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.id).select("name email role");
      if (!user) return next(new Error("User not found"));
      socket.user = user;
      next();
    } catch {
      next(new Error("Invalid socket token"));
    }
  });

  io.on("connection", socket => {
    socket.on("ticket:join", async ticketId => {
      try {
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) return;
        const allowed = socket.user.role === "admin" ||
          (socket.user.role === "customer" && String(ticket.customer) === String(socket.user._id)) ||
          (socket.user.role === "agent" && (!ticket.assignedAgent || String(ticket.assignedAgent) === String(socket.user._id)));
        if (allowed) socket.join(`ticket:${ticket._id}`);
      } catch { /* Ignore invalid IDs or database errors for this join request. */ }
    });
  });
}
