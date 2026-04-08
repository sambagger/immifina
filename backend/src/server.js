import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import aiRoutes from "./routes/ai.js";
import conversationRoutes from "./routes/conversations.js";
import profileRoutes from "./routes/profile.js";
import forecastRoutes from "./routes/forecast.js";
import benefitsRoutes from "./routes/benefits.js";
import waitlistRoutes from "./routes/waitlist.js";

const app = express();
const port = Number(process.env.PORT) || 4000;

// CORS — allow frontend to call backend with cookies
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "https://immifina.org",
  "https://www.immifina.org",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
app.use("/ai", aiRoutes);
app.use("/conversations", conversationRoutes);
app.use("/profile", profileRoutes);
app.use("/forecast", forecastRoutes);
app.use("/benefits", benefitsRoutes);
app.use("/waitlist", waitlistRoutes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "immifina-backend" });
});

app.listen(port, () => {
  console.log(`ImmiFina backend running at http://127.0.0.1:${port}`);
});
