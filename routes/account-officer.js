import express from 'express';
import {

    createAccountOfficerAccount,
    accountOfficerLogin
} from '../controllers/admin.js';

import { 
    acceptStatementProcessing,
    statementReport,
    getAllAccountOfficersPendingReports,
    updateAnalysedStatementStatus
 } from '../controllers/accountOfficer.js';

import { adminProtect, isAdmin } from '../middleware/adminmiddleware.js';
import { accountOfficerProtect, isAccountOfficer } from '../middleware/account_officer_middleware.js';
import multer from 'multer';

const upload = multer();


const router = express.Router();

router.route('/signup').post(adminProtect, isAdmin, createAccountOfficerAccount)
router.route('/login').post(accountOfficerLogin);

router.route('/accept-statement').post(accountOfficerProtect, isAccountOfficer, acceptStatementProcessing)
router.route('/statement-report').post(
    accountOfficerProtect,
    isAccountOfficer,
    upload.single('report'),
    statementReport
)
router.route('/pending-reports').get(accountOfficerProtect, isAccountOfficer, getAllAccountOfficersPendingReports)
router.route('/report-status').patch(accountOfficerProtect, isAccountOfficer, updateAnalysedStatementStatus)



export default router;