import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password || password.length < 8) {
      return res.status(400).json({ message: "Name, valid email, and password (8+ characters) are required" });
    }
    const normalizedEmail = email.toLowerCase().trim();
    if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ message: "Email is already registered" });
    // Public registration always creates a customer. Never accept role from the request body.
    const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash: await bcrypt.hash(password, 12), role: "customer" });
    return res.status(201).json({ token: signToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Email is already registered" });
    return res.status(500).json({ message: "Could not register user" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password;
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user || !await bcrypt.compare(password || "", user.passwordHash)) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }
    return res.json({ token: signToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch {
    return res.status(500).json({ message: "Could not log in" });
  }
});

router.get("/me", requireAuth, (req, res) => res.json({ user: req.user }));

export default router;
