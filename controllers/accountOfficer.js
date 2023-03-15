import asyncHandler from "express-async-handler";
import { statementProcessSchema, statementReportSchema, statementStatusSchema } from "../utils/schema.js";
import bcrypt from 'bcryptjs'
import Admin from "../models/adminModel.js";
import AnalysedStatement from "../models/analysedStatement.js";
import AccountOfficer from "../models/accountOfficerModel.js";
import jwt from 'jsonwebtoken';
import FormData from "form-data";
import sendUserInsightCompletedEmail from "../utils/sendUserInsightLinkEmail.js";
import sendUserInsightAcceptedEmail from "../utils/sendUserInsightAcceptedEmail.js";
import axios from "axios";
import { validateFiles } from "../utils/utils.js";
import InvoiceGenerator from "../utils/generateTable.js";
import User from "../models/usermodel.js";

const { sign, verify } = jwt;



const acceptStatementProcessing = asyncHandler(async (req, res) => {
    const { error, value } = statementProcessSchema.validate(req.body);

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

    const statement = await AnalysedStatement.findOne({ key: value.key });

    if (statement.status === 'processing') {
        res
            .status(403)
            .json(
                {
                    status: "error",
                    message: "this statement is already being processed",
                    meta: {}
                })
        return
    } else if (statement.status === 'completed') {
        res
            .status(403)
            .json(
                {
                    status: "error",
                    message: "this statement is completed",
                    meta: {}
                })
        return
    } else {
        const account_officer = await AccountOfficer.findById(req.user.id);
        statement.accepted = true;
        statement.analysedBy = account_officer;
        statement.status = 'processing';
        account_officer.analyseStatus = 'processing';
        account_officer.pendingReportCount = account_officer.pendingReportCount - 1;;
        account_officer.pendingReports = account_officer?.pendingReports.splice(account_officer?.pendingReports.indexOf(value.key), 1);

        await account_officer.save();
        await statement.save();
        await sendUserInsightAcceptedEmail(statement.reportOwnerId);

        res
            .status(200)
            .json(
                {
                    status: "success",
                    message: "statement insighted accepted successfully",
                    data: statement,
                    meta: {}
                })

    }

})



const statementReport = asyncHandler(async (req, res) => {

    const { error, value } = statementReportSchema.validate(req.body);
    const errMsg = validateFiles(req.file)

    if (error || Boolean(errMsg)) {

        return res
            .status(401)
            .json(
                {
                    status: "error",
                    message: "invalid request",
                    meta: {
                        error: error?.message || errMsg
                    }
                })
    }


    try {

        const account_officer = await AccountOfficer.findById(req.user.id);
        const form = new FormData();

        if (account_officer) {
            form.append("file", req.file.buffer, req.file.originalname)
            form.append('upload_preset', 'project');
            form.append('cloud_name', 'dquiwka6j');

            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/dquiwka6j/auto/upload',
                form, {
                headers: {
                    ...form.getHeaders(),
                }
            }
            );

            const url = response.data.secure_url;

            const accountStatement = await AnalysedStatement.findOne({ key: value.key });
            accountStatement.reportLink = url;
            accountStatement.analysedBy = account_officer;
            accountStatement.amountThatCanBeRecouped = value.amount;

            await accountStatement.save();
            await sendUserInsightCompletedEmail(accountStatement.reportOwnerId, value.key);
            // const user = await User.findById(accountStatement.reportOwnerId);


            res
                .status(200)
                .json(
                    {
                        status: "success",
                        message: "statement report addeded successfully",
                        meta: {}
                    })

        }


    } catch (e) {
        console.log(e)
    }
})


const getAllAccountOfficersPendingReports = asyncHandler(async (req, res) => {

    const accountOfficer = await AccountOfficer.findById(req.user.id);

    const account_officer_statements = await AnalysedStatement.find({ key: { $in: accountOfficer.pendingReports } })

    res
        .status(200)
        .json(
            {
                status: "success",
                message: "account officer pending report fetched successfully",
                data: account_officer_statements,
                meta: {}
            })


})


const updateAnalysedStatementStatus = asyncHandler(async (req, res) => {

    const { error, value } = statementStatusSchema.validate(req.body);

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

    const statement = await AnalysedStatement.findOne({ key: value.key })
    if (statement) {
        statement.status = value.status;
        await statement.save();
        res
            .status(200)
            .json(
                {
                    status: "success",
                    message: "statement status updated successfully",
                    meta: {}
                })
    } else {
        res
            .status(403)
            .json(
                {
                    status: "error",
                    message: "invalid",
                    meta: { error: `statement the key ${value.key} does not exist`}
                })
    }





    // const statement = await AnalysedStatement.findOne({key: })
})





export {
    acceptStatementProcessing,
    statementReport,
    getAllAccountOfficersPendingReports,
    updateAnalysedStatementStatus
}