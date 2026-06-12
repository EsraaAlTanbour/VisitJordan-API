import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getPendingProviders,
  approveProvider,
  rejectProvider,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.get("/providers/pending",verifyToken, adminOnly,getPendingProviders);
router.put("/providers/:id/approve",verifyToken,adminOnly,approveProvider);
router.delete("/providers/:id/reject",verifyToken,adminOnly,rejectProvider);
router.get("/", verifyToken, adminOnly, getAllUsers);
router.get("/:id", verifyToken, adminOnly, getUserById);
router.post("/", verifyToken, adminOnly, createUser);
router.put("/:id", verifyToken, adminOnly, updateUser);
router.delete("/:id", verifyToken, adminOnly, deleteUser);

export default router;