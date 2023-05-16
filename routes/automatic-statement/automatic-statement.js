import express from 'express';
import { protect, isAutomatic, isAuto } from '../../middleware/authMiddleware.js';
import { automateStatementAnalysis, confirmAutomaticCredentials, getAutomaticProcessingStatus, getAutomaticStatementAnalysis } from '../../controller-latest/automatic-statement.js';

const router = express.Router();

router.route('/analysis')
    .post(protect, automateStatementAnalysis)
    .get(protect, isAuto, getAutomaticStatementAnalysis)

router.route('/analysis-statement/:key')
    .post(protect, confirmAutomaticCredentials);
// .get(protect, isAutomatic, getAutomaticProcessingStatus)


export default router;