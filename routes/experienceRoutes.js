import express from "express";
import {
  getAllExperiences,
  getExperienceById,
  getProviderExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  approveExperience,
  rejectExperience,
} from "../controllers/experienceController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { adminOnly, providerOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getAllExperiences);

router.get(
  "/provider/my-experiences",
  verifyToken,
  providerOnly,
  getProviderExperiences
);

router.get("/:id", getExperienceById);

router.post("/", verifyToken, providerOnly, createExperience);
router.put("/:id", verifyToken, providerOnly, updateExperience);
router.delete("/:id", verifyToken, providerOnly, deleteExperience);

router.put("/admin/:id", verifyToken, adminOnly, updateExperience);
router.delete("/admin/:id", verifyToken, adminOnly, deleteExperience);

router.put("/:id/approve", verifyToken, adminOnly, approveExperience);
router.put("/:id/reject", verifyToken, adminOnly, rejectExperience);

export default router;