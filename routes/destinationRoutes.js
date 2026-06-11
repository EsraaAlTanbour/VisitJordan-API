import express from "express";
import {
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
} from "../controllers/destinationController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getAllDestinations);
router.get("/:id", getDestinationById);
router.post("/", verifyToken, adminOnly, createDestination);
router.put("/:id", verifyToken, adminOnly, updateDestination);
router.delete("/:id", verifyToken, adminOnly, deleteDestination);

export default router;