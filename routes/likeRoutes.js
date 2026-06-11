import express from "express";
import {
  addLike,
  getLikesByUser,
  deleteLike,
} from "../controllers/likeController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { userOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/user/:user_id", getLikesByUser);
router.post("/", verifyToken, userOnly, addLike);
router.delete("/:id", verifyToken, userOnly, deleteLike);

export default router;