import express from "express";
const router = express.Router();
import { 
    signUp, 
    loginUser, 
    getPasswordResetToken, 
    verifyOtp, 
    resetPassword,
    verifyEmail,
    joinWaitlist
 } from "../controllers/authControllers.js";


router.route('/signup').post(signUp);
router.route('/login').post(loginUser)
router.route('/verify-email').post(verifyEmail)

router.route('/reset').post(getPasswordResetToken)
router.route('/reset-password').patch(resetPassword)
router.route('/verify-otp').post(verifyOtp)

router.route('/waitlist').post(joinWaitlist)



export default router