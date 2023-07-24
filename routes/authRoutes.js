import express from "express";
const router = express.Router();
import { 
    signUp, 
    loginUser, 
    getPasswordResetToken, 
    verifyOtp, 
    resetPassword,
    verifyEmail,
    joinWaitlist,
    getOneUserDetails
 } from "../controllers/authControllers.js";
 import { protect } from "../middleware/authMiddleware.js";

router.route('/').get(protect, getOneUserDetails)
router.route('/signup').post(signUp);
router.route('/login').post(loginUser)
router.route('/verify-email').post(verifyEmail)
router.route('/reset').post(getPasswordResetToken)
router.route('/reset-password').patch(resetPassword)
router.route('/verify-otp').post(verifyOtp)

router.route('/waitlist').post(joinWaitlist)



export default router