import AccountingFirm from "../../models/accounting-firm.js";
import asyncHandler from "express-async-handler";
import { createNewAccountSchema, createNewAccountingFirmSchema } from "../../utils/schema.js";
import Accountants from "../../models/accountant.js";



const createNewAccountingFirm = asyncHandler(async (req, res) => {
    const { error, value } = createNewAccountingFirmSchema.validate(req.body);
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

    const af = new AccountingFirm(value);
    await af.save();
    res
        .status(200)
        .json(
            {
                status: 'success',
                message: "Account firm created successfully",
                meta: {}
            })
})

const getAllAccountingFirms = asyncHandler(async (req, res) => {
    const allAccountingFirms = await AccountingFirm.find();
    res
        .status(200)
        .json(
            {
                status: 'success',
                data: allAccountingFirms,
                meta: {}
            })
})

const deleteAccountingFirm = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const checkExists = await AccountingFirm.findById({ _id: id });
    if (checkExists) {
        await AccountingFirm.findByIdAndDelete(id);
        res
            .status(200)
            .json(
                {
                    status: 'success',
                    message: "Deleted successfully",
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
                        error: `Accounting firm with id ${id} does not exist`
                    }
                })
    }
})

const getOneAccountingFirm = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const firm = await AccountingFirm.findById({ _id: id }).populate('accounts')
    if (firm) {
        res
            .status(200)
            .json(
                {
                    status: 'success',
                    data: firm,
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
                        error: `Accounting firm with id ${id} does not exist`
                    }
                })
    }
})

const createNewAccountant = asyncHandler(async (req, res) => {
    const { error, value } = createNewAccountSchema.validate(req.body);
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
    const { firm_id } = req.query;

    const firm = await AccountingFirm.findById({ _id: firm_id });
    if (firm) {
        const accountant = new Accountants(value);
        await accountant.save();
        firm.accounts = accountant;
        await firm.save();
        res
            .status(200)
            .json(
                {
                    status: 'success',
                    message: "Accountant added successfully",
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
                        error: `Accounting firm with id ${firm_id} does not exist`
                    }
                })
    }
})


export {
    createNewAccountingFirm,
    getAllAccountingFirms,
    deleteAccountingFirm,
    getOneAccountingFirm,
    createNewAccountant
}