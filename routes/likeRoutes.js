import express from "express";
import {
  addLike,
  getLikesByUser,
  deleteLike,
} from "../controllers/likeController.js";

const router = express.Router();

router.post("/", addLike);
router.get("/user/:user_id", getLikesByUser);
router.delete("/:id", deleteLike);

export default router;