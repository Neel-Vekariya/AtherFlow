import express, { Router } from "express";
import { verifyWebhookSignature } from "../auth/webhooksignature.js";
import { authMiddleware } from "../auth/middleware.js";

const webhookRouter=Router()

webhookRouter.post("/",authMiddleware, (req, res, next) => {
  try {
    verifyWebhookSignature(
      req.headers["x-signature"],
      req.rawBody,
      process.env.WEBHOOK_SECRET
    );

    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default webhookRouter