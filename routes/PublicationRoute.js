import express from "express";
import {
  getBlog,
  getPublications,
  getPublicationById,
  createPublication,
  updatePublication,
  deletePublication,
  getBlogById,
} from "../controllers/Publications.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/blog", getBlog);
router.get("/blog/:id", getBlogById);
router.get("/publications", verifyUser, getPublications);
router.get("/publications/:id", verifyUser, getPublicationById);
router.post("/publications", verifyUser, createPublication);
router.patch("/publications/:id", verifyUser, updatePublication);
router.delete("/publications/:id", verifyUser, deletePublication);

export default router;
