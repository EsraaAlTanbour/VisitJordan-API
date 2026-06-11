import express from "express";
import {
  getAllExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
  approveExperience,
  rejectExperience,
} from "../controllers/experienceController.js";

const router = express.Router();

router.get("/", getAllExperiences);
router.get("/:id", getExperienceById);
router.post("/", createExperience);
router.put("/:id", updateExperience);
router.delete("/:id", deleteExperience);
router.put("/:id/approve", approveExperience);
router.put("/:id/reject", rejectExperience);


export default router;