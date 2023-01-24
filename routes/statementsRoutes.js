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
    getStatementAnalytics
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
router.route('/manual-upload', ).post(protect, hasTicketId, upload.single('file'), manualStatement)
router.route('/analytics').get(protect, hasStatemetKey, getStatementAnalytics)
router.route('/webhook').post(statementWebhook)

router.route('/banks/:id').delete(protect, bankExist, deletebankAccount)


export default router