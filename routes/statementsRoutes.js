import express from "express";
const router = express.Router();
import { 
    getListOfAvailableBanks,
    automateStatements
 } from "../controllers/statementControllers.js";
import { protect } from "../middleware/authMiddleware.js";


router.route('/available-banks').get(protect, getListOfAvailableBanks);
router.route('/request').post(protect, automateStatements)


export default router