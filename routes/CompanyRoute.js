import express from "express";
import {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../controllers/Companies.js";

const router = express.Router();

router.get("/Companies", getCompanies);
router.get("/Companies/:id", getCompanyById);
router.post("/Companies", createCompany);
router.patch("/Companies/:id", updateCompany);
router.delete("/Companies/:id", deleteCompany);

export default router;
