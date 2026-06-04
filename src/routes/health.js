import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

router.get("/ready", (req, res) => {
    res.status(200).json({ ready: true });
});

export default router;