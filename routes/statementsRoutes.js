import express from "express";
const router = express.Router();
import {
    getListOfAvailableBanks,
    automateStatements,
    confirmChargeCustomer,
    getStatementStatus,
    getPdfStatement,
    manualStatement,
    statementWebhook,
    getStatementAnalytics,
    insightPaymentWebhook,
    getManualBanks
} from "../controllers/statementControllers.js";
//  import { addMessageToQueue } from "../controllers/queue.js";
import multer from "multer";
import { protect, hasRequestId, hasTicketId, hasStatemetKey, bankExist } from "../middleware/authMiddleware.js";
import {
    getAllDepositTypes,
    getAllLoanTypes,
    addDocumentToLoan,
    addBankStatementFile,
    getAllAnalysedStatements,
    getAllStatus,
    deletebankAccount,
    addStatusReport,
    getUserbanks,
    deleteUserStatment,
    getAllRecoverableReqeuest
} from "../controllers/statementControllers2.js";
import { sendRecoveryRequest } from "../controllers/accountOfficer.js";
import bodyParser from "body-parser";

const upload = multer()

router.route('/available-banks').get(protect, getListOfAvailableBanks);
router.route('/request').post(protect, automateStatements)
router.route('/confirm/:requestId').post(protect, confirmChargeCustomer)
router.route('/status/:requestId').get(protect,getStatementStatus)
router.route('/').get(protect, hasTicketId, getPdfStatement)
// router.route('/automatic').post(protect, addMessageToQueue)
router.route('/manual-upload',).post(protect, upload.single('statement'), manualStatement)
router.route('/analytics').get(protect, hasStatemetKey, getStatementAnalytics)
router.route('/webhook').post(bodyParser.text({type: '*/*'}), statementWebhook)
router.route('/paystack-webhook').post(insightPaymentWebhook)
router.route('/banks/:id').delete(protect, bankExist, deletebankAccount)
router.route('/manual-banks').get( getManualBanks)

router.route('/deposit-types').get(getAllDepositTypes)
router.route('/loan-types').get(getAllLoanTypes)
router.route('/add-document').post(addDocumentToLoan)
router.route('/add-statement').post(protect, addBankStatementFile)
router.route('/get-statements').get(protect, getAllAnalysedStatements)

router.route('/track-statement/:key').get(protect, getAllStatus);
router.route('/statement-status').post(protect, addStatusReport);

router.route('/get-user-banks').get(protect, getUserbanks)

router.route('/delete-user-statement/:key').delete(protect, deleteUserStatment)

router.route('/reovery-request')
.post(protect, sendRecoveryRequest)
.get(protect, getAllRecoverableReqeuest)

export default router