import express from 'express';
import {

    createAccountOfficerAccount,
    accountOfficerLogin
} from '../controllers/admin.js';

import {
    acceptStatementProcessing,
    statementReport,
    getAllAccountOfficersPendingReports,
    updateAnalysedStatementStatus,
    addStatusReport,
    getAllReports,
    getAllAccountOfficers,
    manualAssign,
    getAllStateWithRecoveryRequest,
    commenceStatementRecovery,
    sendEmailToUser
} from '../controllers/accountOfficer.js';
import { getAllUsers } from '../controllers/statementControllers2.js';
import { adminProtect, isAdmin } from '../middleware/adminmiddleware.js';
import { accountOfficerProtect, isAccountOfficer } from '../middleware/account_officer_middleware.js';
import multer from 'multer';

const upload = multer();


const router = express.Router();
// adminProtect, isAdmin,
router.route('/signup').post( createAccountOfficerAccount)
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
router.route('/all-users').get(getAllUsers)
router.route('/statement-status').post(accountOfficerProtect, addStatusReport);

router.route('/all-reports/:type').get(accountOfficerProtect, getAllReports)
router.route('/all-account-officer').get(accountOfficerProtect, getAllAccountOfficers)
router.route('/manual-assign').post(accountOfficerProtect, manualAssign)

router.route('/all-recovery-request').get(accountOfficerProtect, isAccountOfficer, getAllStateWithRecoveryRequest)
router.route('/commence-recovery').patch(accountOfficerProtect, isAccountOfficer, commenceStatementRecovery)

router.route('/send-user-email').post(accountOfficerProtect, sendEmailToUser)



export default router;