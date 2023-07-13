import AccountingFirm from "../../models/accounting-firm.js";
import asyncHandler from "express-async-handler";
import Accountants from "../../models/accountant.js";
import BusinessDevelopers from "../../models/business-developers.js";


const getAllBusinessDevelopers = asyncHandler(async (req, res) => {
    const data = await BusinessDevelopers.find({}, { password: 0});
    res
        .status(200)
        .json(
            {
                status: 'success',
                data,
                meta: {}
            })
})


export {
    getAllBusinessDevelopers
}