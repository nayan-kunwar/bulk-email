import express from "express";
import { emailQueue } from "../queue/email.queue.js";

const router = express.Router();

router.post("/send-bulk", async (req, res) => {
  const { recipients, subject, html } = req.body;

  if (!recipients?.length) {
    return res.status(400).json({ message: "No recipients" });
  }

  const jobs = recipients.map((email) => ({
    name: "send-email",
    data: { email, subject, html },
  }));
  console.log(jobs);

  await emailQueue.addBulk(jobs);

  res.json({
    success: true,
    queued: recipients.length,
  });
});

export default router;
