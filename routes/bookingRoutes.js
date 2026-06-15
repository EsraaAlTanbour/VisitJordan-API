import express from "express";
import {
  getAllBookings,
  getBookingById,
  getBookingsByUser,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/bookingController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { userOnly, adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, adminOnly, getAllBookings);
router.get("/my-bookings", verifyToken, userOnly, getBookingsByUser);
router.get("/:id", verifyToken, getBookingById);

router.post("/", verifyToken, userOnly, createBooking);
router.put("/:id", verifyToken, userOnly, updateBooking);
router.delete("/:id", verifyToken, userOnly, deleteBooking);

export default router;