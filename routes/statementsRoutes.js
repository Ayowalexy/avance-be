import express from "express";
const router = express.Router();
import { 
    getListOfAvailableBanks,
    automateStatements,
    confirmChargeCustomer,
    getStatementStatus,
    getPdfStatement,
    manualStatement
 } from "../controllers/statementControllers.js";
 import { addMessageToQueue } from "../controllers/queue.js";
 import multer from "multer";
import { protect, hasRequestId, hasTicketId } from "../middleware/authMiddleware.js";


const upload = multer()

router.route('/available-banks').get(protect, getListOfAvailableBanks);
router.route('/request').post(protect, automateStatements)
router.route('/confirm').post(protect, confirmChargeCustomer)
router.route('/status').get(protect, hasRequestId, getStatementStatus)
router.route('/').get(protect, hasTicketId, getPdfStatement)
router.route('/automatic').post(protect, addMessageToQueue)
router.route('/manual-upload', ).post(protect, hasTicketId, upload.single('image'), manualStatement)


export default router