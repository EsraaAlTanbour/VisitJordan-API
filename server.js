import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import pool from "./db.js";
import cityRoutes from "./routes/cityRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import experienceImageRoutes from "./routes/experienceImageRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import userRoutes from "./routes/userRoutes.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/cities", cityRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/experience-images", experienceImageRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/users", userRoutes);




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