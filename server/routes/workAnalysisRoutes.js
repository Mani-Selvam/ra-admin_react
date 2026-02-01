import express from "express";
import {
    createWorkAnalysis,
    updateApproval,
    getWorkAnalysis,
} from "../controllers/workAnalysisController.js";
import { auth } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// @route   POST /api/work-analysis
// @desc    Create Work Analysis (Worker Submit)
// @Access  Private
router.post("/", auth, upload.array("images", 5), createWorkAnalysis);

// @route   GET /api/work-analysis
// @desc    Get All Work Analysis
// @Access  Private
router.get("/", auth, getWorkAnalysis);

// @route   PUT /api/work-analysis/:id/approve
// @desc    Update Approval Status (Manager Action)
// @Access  Private
router.put("/:id/approve", auth, updateApproval);

export default router;
