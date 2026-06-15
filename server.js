import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


import pool from "./db.js";
import cityRoutes from "./routes/cityRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import experienceImageRoutes from "./routes/experienceImageRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { verifyToken } from "./middleware/authMiddleware.js";
import { adminOnly } from "./middleware/roleMiddleware.js";

dotenv.config();

const app = express();


app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://visitjordan-client-production.up.railway.app"
  ],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/cities", cityRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/experience-images", experienceImageRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.get(
  "/api/admin-dashboard",
  verifyToken,
  adminOnly,
  (req, res) => {
    res.json({
      message: "Welcome Admin",
    });
  }
);



app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "VisitJordan API is running",
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});