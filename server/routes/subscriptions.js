import { Router } from "express";
import Plan from "../models/Plan.js";
import Subscription from "../models/Subscription.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/plans", async (_req, res) => {
  const plans = await Plan.find({ active: true }).sort({ price: 1 });
  res.json({ plans });
});

router.get("/me", async (req, res) => {
  const subscriptions = await Subscription.find({ user: req.user._id }).populate("plan").sort({ createdAt: -1 });
  res.json({ subscriptions });
});

export default router;
