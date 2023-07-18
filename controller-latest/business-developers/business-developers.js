import AccountingFirm from "../../models/accounting-firm.js";
import asyncHandler from "express-async-handler";
import Accountants from "../../models/accountant.js";
import BusinessDevelopers from "../../models/business-developers.js";
import { updateStatusSchema } from "../../utils/schema.js";
import AnalysedStatement from "../../models/analysedStatement.js";


const getAllBusinessDevelopers = asyncHandler(async (req, res) => {
    const data = await BusinessDevelopers.find({}, { password: 0 });
    res
        .status(200)
        .json(
            {
                status: 'success',
                data,
                meta: {}
            })
})

const getOneBusinessDeveloper = asyncHandler(async (req, res) => {
    const { id } = req.params
    const bd = await BusinessDevelopers.findById({ _id: id }, { password: 0 });
    const uploads = await AnalysedStatement.find({
        businessDeveloper: id
    })

    if (bd) {
        res
            .status(200)
            .json(
                {
                    status: 'success',
                    data: {
                        bd,
                        uploads
                    },
                    meta: {}
                })
    } else {
        res
            .status(401)
            .json(
                {
                    status: "error",
                    message: "invalid request",
                    meta: {
                        error: `Business developer with id ${id} does not exist`
                    }
                })
    }
})


const suspendBusinessDeveloper = asyncHandler(async (req, res) => {
    const { error, value } = updateStatusSchema.validate(req.body);
    if (error) {
        return res
            .status(401)
            .json(
                {
                    status: "error",
                    message: "invalid request",
                    meta: {
                        error: error.message
                    }
                })
    }

    const { id } = req.params;

    await BusinessDevelopers.findByIdAndUpdate(
        { _id: id },
        { status: value.status }
    )
    res
        .status(200)
        .json(
            {
                status: 'success',
                message: "Status updates successfully",
                meta: {}
            })
})

const deleteBusinesDeveloper = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await BusinessDevelopers.findByIdAndDelete({ _id: id });
    res
        .status(200)
        .json(
            {
                status: 'success',
                message: "Status updates successfully",
                meta: {}
            })
})


const uploadProveOfPayment = asyncHandler(async (req, res) => {

    const { statement_id, date_of_payment, amount_paid } = req.body;
    if (statement_id && date_of_payment && amount_paid && req.file?.path) {

        await AnalysedStatement.findByIdAndUpdate(
            { _id: statement_id },
            {
                proof_of_payment: req.file?.path,
                date_of_payment,
                amount_paid
            }
        )

        res
            .status(200)
            .json(
                {
                    status: 'success',
                    message: "Payment proof added successfully",
                    meta: {}
                })
    } else {
        res
            .status(401)
            .json(
                {
                    status: "error",
                    message: "invalid request",
                    meta: {
                        error: 'Invalid request'
                    }
                })
    }

})

export {
    getAllBusinessDevelopers,
    getOneBusinessDeveloper,
    deleteBusinesDeveloper,
    suspendBusinessDeveloper,
    uploadProveOfPayment
}