import express from 'express';
import { protect, isAutomatic } from '../../middleware/authMiddleware.js';
import { automateStatementAnalysis, confirmAutomaticCredentials, getAutomaticProcessingStatus } from '../../controller-latest/automatic-statement.js';

const router = express.Router();

router.route('/analysis')
.post(protect, automateStatementAnalysis)
.get(protect, isAutomatic, getAutomaticProcessingStatus)

router.route('/analysis/:requestId')
.put(protect, confirmAutomaticCredentials)

export default router;