import express from "express";
import dotenv from "dotenv";
import campaignRoutes from "./routes/campaign.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/campaigns", campaignRoutes);

app.listen(8080, () => {
  console.log("🚀 Server running on port 8080");
});
