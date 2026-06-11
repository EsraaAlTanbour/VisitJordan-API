import express from "express";
import {
  getAllCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
} from "../controllers/cityController.js";


import { verifyToken } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();



router.get("/", getAllCities);
router.get("/:id", getCityById);
router.post("/",verifyToken, adminOnly, createCity);
router.put("/:id",verifyToken, adminOnly, updateCity);
router.delete("/:id",verifyToken, adminOnly, deleteCity);

export default router;