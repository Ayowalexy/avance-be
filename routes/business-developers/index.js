import express from "express";
import { login, changePassword, createNewBDAccount, getUserDetails, getStats } from "../../controller-latest/business-developers/authentication.js";
import { bdprotect } from "../../middleware/business-developers.js";

const router = express.Router();

router.route('/sign-up').post(createNewBDAccount)
router.route('/login').post(login)

router.route('/change-password').patch(bdprotect, changePassword)

router.route('/user').get(bdprotect, getUserDetails)

router.route('/stats').get(bdprotect, getStats)

export default router