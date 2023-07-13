import AccountingFirm from "../../models/accounting-firm.js";
import asyncHandler from "express-async-handler";
import { assignReportSchema, createNewAccountSchema, createNewAccountingFirmSchema } from "../../utils/schema.js";
import Accountants from "../../models/accountant.js";
import AnalysedStatement from "../../models/analysedStatement.js";
import notifyFirmOfNewReport from "../../utils/notify-firm.js";



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
                firm_id: af._id.toString(),
                meta: {}
            })
})

const getAllAccountingFirms = asyncHandler(async (req, res) => {
    const allAccountingFirms = await AccountingFirm.aggregate([
        {
            $match: {
                $expr: {
                    $gt: [{ $size: '$accounts' }, 0]
                }
            }
        }
    ])
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


const assignReportToFirm = asyncHandler(async (req, res) => {
    const { error, value } = assignReportSchema.validate(req.body);
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

    const { firm_id, report_id, comment = '' } = value;

    const firm = await AccountingFirm.findById({ _id: firm_id }).populate('accountants');
    const report = await AnalysedStatement.findById({ _id: report_id });

    if (firm && report) {
        firm.reports.push(report);
        report.analysingFirm = firm;

        await firm.save();
        await report.save();

        const firmAdmin = firm.accounts?.find((oneAccountant) => oneAccountant.role === 'admin');
        if (firmAdmin) {
            await notifyFirmOfNewReport(firmAdmin.email, firmAdmin.name, comment)
        } else {
            const oneUser = firm.accounts[0];
            await notifyFirmOfNewReport(oneUser.email, oneUser.name, comment)
        }

        res
            .status(200)
            .json(
                {
                    status: 'success',
                    message: "Report assigned successfully",
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
                        error: 'An Error occured'
                    }
                })
    }
})


export {
    createNewAccountingFirm,
    getAllAccountingFirms,
    deleteAccountingFirm,
    getOneAccountingFirm,
    createNewAccountant,
    assignReportToFirm
}