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
import { deletebankAccount } from "../controllers/statementControllers2.js";
 import multer from "multer";
import { protect, hasRequestId, hasTicketId, hasStatemetKey, bankExist } from "../middleware/authMiddleware.js";


const upload = multer()

router.route('/available-banks').get(protect, getListOfAvailableBanks);
router.route('/request').post(protect, automateStatements)
router.route('/confirm').post(protect, confirmChargeCustomer)
router.route('/status').get(protect, hasRequestId, getStatementStatus)
router.route('/').get(protect, hasTicketId, getPdfStatement)
// router.route('/automatic').post(protect, addMessageToQueue)
router.route('/manual-upload', ).post(protect, upload.single('statement'), manualStatement)
router.route('/analytics').get(protect, hasStatemetKey, getStatementAnalytics)
router.route('/webhook').get(statementWebhook)
router.route('/paystack-webhook').post(insightPaymentWebhook)
router.route('/banks/:id').delete(protect, bankExist, deletebankAccount)
router.route('/manual-banks').get(protect, getManualBanks)


export default router