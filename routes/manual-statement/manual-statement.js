import express from "express";
import { protect, isManual } from "../../middleware/authMiddleware.js";
import { manualStatementAnalysis, getManualStatementStatus } from "../../controller-latest/manual-statement.js";
import multer from "multer";
const upload = multer()


const router = express.Router();

router.route('/analysis')
.post(protect, upload.single('statement'), manualStatementAnalysis)
.get(protect, isManual, getManualStatementStatus)


export default router