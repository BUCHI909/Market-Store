import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";  // ← ADD THIS
import adminRoutes from "./routes/adminRoutes.js"; // ← ADD THIS

dotenv.config();

const app = express();

const allowedOrigins = ["http://localhost:5173", "https://market-store-gamma.vercel.app/"]; 

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/payments", paymentRoutes);  // ← ADD THIS
app.use("/api/admin", adminRoutes); // ← ADD THIS

app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => {
  res.send("MarketSphere API Running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));