import express from 'express';
import { bdprotect, isAdmin } from '../../middleware/business-developers.js';
import { getAllBusinessDevelopers, getOneBusinessDeveloper, deleteBusinesDeveloper, suspendBusinessDeveloper } from '../../controller-latest/business-developers/business-developers.js';

const router = express.Router();

router.route('/').get(bdprotect, getAllBusinessDevelopers);

router.route('/:id')
    .get(bdprotect, getOneBusinessDeveloper)

router.route('/:id')
    .patch(bdprotect, isAdmin, suspendBusinessDeveloper)
    .delete(bdprotect, isAdmin, deleteBusinesDeveloper)


export default router;