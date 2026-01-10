import { Queue } from "bullmq";
import Redis from "ioredis";
import "dotenv/config";

const redis = new Redis(process.env.REDIS_URL, {
  tls: {},
  maxRetriesPerRequest: null,
});

export const emailQueue = new Queue("email-queue", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5_000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

const counts = await emailQueue.getJobCounts();
// console.log("📊 Email queue stats:", counts);

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err);
});
