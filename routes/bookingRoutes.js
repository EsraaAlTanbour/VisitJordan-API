import express from "express";
import {
  getAllBookings,
  getBookingById,
  getBookingsByUser,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.get("/", getAllBookings);
router.get("/user/:user_id", getBookingsByUser);
router.get("/:id", getBookingById);
router.post("/", createBooking);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

export default router;