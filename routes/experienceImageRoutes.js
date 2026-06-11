import express from "express";
import {
  getImagesByExperience,
  addExperienceImage,
  updateExperienceImage,
  deleteExperienceImage,
} from "../controllers/experienceImageController.js";

const router = express.Router();

router.get("/experience/:experience_id", getImagesByExperience);
router.post("/", addExperienceImage);
router.put("/:id", updateExperienceImage);
router.delete("/:id", deleteExperienceImage);

export default router;