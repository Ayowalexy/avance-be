import express from 'express';
import {
    createNewAccountingFirm,
    getAllAccountingFirms,
    deleteAccountingFirm,
    getOneAccountingFirm,
    createNewAccountant,
    assignReportToFirm,
    reasignStatementAnalysis
} from '../../controller-latest/business-developers/accounting-firm.js';
import { bdprotect } from '../../middleware/business-developers.js';

const router = express.Router();

router.route('/firm')
    .post(bdprotect, createNewAccountingFirm)
    .get(bdprotect, getAllAccountingFirms)

router.route('/firm/:id')
    .delete(bdprotect, deleteAccountingFirm)
    .get(bdprotect, getOneAccountingFirm)

router.route('/firm/accountant')
    .post(bdprotect, createNewAccountant)

router.route('/firm/assign')
    .post(bdprotect, assignReportToFirm)
    .patch(bdprotect, reasignStatementAnalysis)


export default router