import express from "express";
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();


router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.post("/", verifyToken, adminOnly,createBlog);
router.put("/:id", verifyToken, adminOnly, updateBlog);
router.delete("/:id", verifyToken, adminOnly, deleteBlog);

export default router;