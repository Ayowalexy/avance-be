import express from 'express';
import { bdprotect } from '../../middleware/business-developers.js';
import { getAllBusinessDevelopers } from '../../controller-latest/business-developers/business-developers.js';

const router = express.Router();

router.route('/').get(bdprotect, getAllBusinessDevelopers);

export default router;