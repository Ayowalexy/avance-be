import express from 'express';
import { bdprotect, isAdmin } from '../../middleware/business-developers.js';
import { 
    getAllBusinessDevelopers, 
    getOneBusinessDeveloper, 
    deleteBusinesDeveloper, 
    suspendBusinessDeveloper,
    uploadProveOfPayment
 } from '../../controller-latest/business-developers/business-developers.js';
import multer from 'multer';
import { storage } from '../../cloudinary/cloudinary.js';


const upload = multer({ storage })

const router = express.Router();

router.route('/').get(bdprotect, getAllBusinessDevelopers);

router.route('/:id')
    .get(bdprotect, getOneBusinessDeveloper)

router.route('/:id')
    .patch(bdprotect, isAdmin, suspendBusinessDeveloper)
    .delete(bdprotect, isAdmin, deleteBusinesDeveloper)

router.route('/payment-proof')
    .post(bdprotect, upload.single('file'), uploadProveOfPayment)


export default router;