import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { getAllAnalysedStatements } from "../../controller-latest/manual-statement.js";

const router = express.Router();

router.route('/all-analysed-statement').get(protect, getAllAnalysedStatements)

export default router