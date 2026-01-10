import { Worker } from "bullmq";
import Redis from "ioredis";
import { sendEmail } from "../services/resend.service.js";

const redis = new Redis(process.env.REDIS_URL, {
  tls: {},
  maxRetriesPerRequest: null,
});

new Worker(
  "email-queue",
  async (job) => {
    const { email, subject, html } = job.data;

    await sendEmail({
      to: email,
      subject,
      html,
    });

    console.log(`✅ Sent email to ${email}`);
  },
  {
    connection: redis,
    concurrency: 1,
    limiter: {
      max: 1, // 👈 1 emails // 2emails/sec resend limit
      duration: 1000, // 👈 per second
    },
  }
);
