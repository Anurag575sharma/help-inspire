require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");

const campaignRoutes = require("./routes/campaign");
const paymentRoutes = require("./routes/payment");

const app = express();

// Security headers
app.use(helmet());

// CORS — supports comma-separated origins in FRONTEND_URL
const allowedOrigins = (process.env.FRONTEND_URL || "*").split(",").map((s) => s.trim());
app.use(cors({
  origin: allowedOrigins.length === 1 && allowedOrigins[0] === "*" ? "*" : allowedOrigins,
}));

// Rate limiting on payment routes (20 requests per 15 min per IP)
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api/create-order", paymentLimiter);
app.use("/api/verify-payment", paymentLimiter);

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.use("/api", campaignRoutes);
app.use("/api", paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
