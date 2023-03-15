import express from 'express';
import { 
    AdminSignUp,
    adminLogin,
    createAccountOfficerAccount,
    accountOfficerLogin
 } from '../controllers/admin.js';

import { getAllUsers } from '../controllers/statementControllers2.js';

 import { adminProtect, isAdmin } from '../middleware/adminmiddleware.js';

const router = express.Router();


router.route('/signup').post(AdminSignUp);
router.route('/login').post(adminLogin)



export default router;