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
import { userOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getAllBookings);
router.get("/user/:user_id", getBookingsByUser);
router.get("/:id", getBookingById);
router.post("/",verifyToken, userOnly, createBooking);
router.put("/:id",verifyToken, userOnly, updateBooking);
router.delete("/:id",verifyToken, userOnly, deleteBooking);

export default router;