import express from "express";
import {
  getImagesByExperience,
  addExperienceImage,
  updateExperienceImage,
  deleteExperienceImage,
} from "../controllers/experienceImageController.js";
 
import { verifyToken } from "../middleware/authMiddleware.js";
import { providerOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/experience/:experience_id", getImagesByExperience);
router.post("/",verifyToken, providerOnly, addExperienceImage);
router.put("/:id",verifyToken, providerOnly, updateExperienceImage);
router.delete("/:id",verifyToken, providerOnly, deleteExperienceImage);

export default router;