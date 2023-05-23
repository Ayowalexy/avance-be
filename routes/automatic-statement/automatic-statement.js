import express from 'express';
import { protect, isAutomatic, isAuto } from '../../middleware/authMiddleware.js';
import { automateStatementAnalysis, confirmAutomaticCredentials, getAutomaticProcessingStatus, getAutomaticStatementAnalysis } from '../../controller-latest/automatic-statement.js';

const router = express.Router();

router.route('/analysis')
    .post(protect, automateStatementAnalysis)
    .get(protect, isAuto, getAutomaticStatementAnalysis)

router.route('/analysis/:key')
    .put(protect, confirmAutomaticCredentials)

router.route('/analysis-status/:key')
.get(protect, getAutomaticProcessingStatus)


export default router;