import express from "express";
import { protect, isManual, protect_ } from "../../middleware/authMiddleware.js";
import { manualStatementAnalysis, getManualStatementStatus, getOneStatement } from "../../controller-latest/manual-statement.js";
import multer from "multer";
const upload = multer()


const router = express.Router();

router.route('/analysis')
    .post(protect_, upload.single('statement'), manualStatementAnalysis)
    .get(protect_, isManual, getManualStatementStatus)


router.route('/statement-analysis/:id')
    .get(protect_, getOneStatement)


export default router