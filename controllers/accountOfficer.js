import asyncHandler from "express-async-handler";
import { statementProcessSchema, statementReportSchema, statementStatusSchema, statusSchema, manualStatementAssign, recoveryReequestSchema, sendEmailShema } from "../utils/schema.js";
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
import Status from "../models/statusModel.js";
import sendAccountOfficerEmail from "../utils/sendEmail.js";
import { sendAccountOfficerEmailOfNewSignmentInsight } from "../utils/sendAccountOfficerInsightEmail.js";
import sendAccountOfficerRecoveryEmail from "../utils/sendAccountOfficerRecoveryRequestEmail.js";
import sendUserRecoveryCommencementEmail from "../utils/sendUserRecoveryCommencementEmail.js";
import AccountOfficerToUserEmail from "../utils/account_officer-user-email.js";

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
        const status = new Status({
            message: "Your statement has been assigned to an account officer",
            status: 'processing',
            key: value.key
        })
        await status.save();

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
                    meta: { error: `statement the key ${value.key} does not exist` }
                })
    }





    // const statement = await AnalysedStatement.findOne({key: })
})

const addStatusReport = asyncHandler(async (req, res) => {
    const { error, value } = statusSchema.validate(req.body);

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

    const user = await AccountOfficer.findById(req.user._id);

    const status = new Status({
        sender: user.firstName.concat(' ', user.lastName),
        message: value.message,
        status: 'pending',
        key: value.key
    })

    await status.save();
    res
        .status(201)
        .json(
            {
                status: "success",
                message: 'status updated',
                meta: {}
            })
})

const getAllReports = asyncHandler(async (req, res) => {

    // enum: ['idle', 'processing', 'declined', 'completed'],

    let reports = [];
    if (req.params.type === 'all') {
        reports = await AnalysedStatement.find().populate('analysedBy').populate('user')
    } else {
        reports = await AnalysedStatement.find({ status: req.params.type }).populate('analysedBy').populate('user')
    }

    console.log(reports)
    res
        .status(201)
        .json(
            {
                status: "success",
                message: 'status updated',
                data: reports,

                meta: {}
            })
})


const getAllAccountOfficers = asyncHandler(async (req, res) => {

    const account_officers = await AccountOfficer.find();
    res
        .status(209)
        .json(
            {
                status: "success",
                message: 'All account officers',
                data: account_officers,
                meta: {}
            })
})

const manualAssign = asyncHandler(async (req, res) => {
    const { error, value } = manualStatementAssign.validate(req.body);

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

    await sendAccountOfficerEmailOfNewSignmentInsight(value.key, value.id);
    const statement = await AnalysedStatement.findOne({ key: value.key });
    const account_officer = await AccountOfficer.findOne({ _id: value.id })
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
        .status(209)
        .json(
            {
                status: "success",
                message: 'Assignsed sucessfully',
                meta: {}
            })

})


const sendRecoveryRequest = asyncHandler(async (req, res) => {
    const { error, value } = recoveryReequestSchema.validate(req.body);

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
    // https://relieved-plum-wetsuit.cyclic.app/api/bank/fund
    const user = await User.findById({ _id: req.user.id });
    const statement = await AnalysedStatement.findOne({ key: value.key }).populate('analysedBy');
    const accountOfficer = await AccountOfficer.findById({ _id: statement.analysedBy._id });

    if (statement && accountOfficer) {
        statement.recoveryReequest = true;
        statement.dateCustomerRequestedForRecovery = new Date();
        statement.engagementLetterLink = value.pdfUrl;

        if (statement.amountThatCanBeRecouped) {
            const customer = user.firstName.concat(' ', user.lastName);
            const amount = statement.amountThatCanBeRecouped;
            const link = value.pdfUrl;
            const id = accountOfficer._id.toString();
            await statement.save();
            await sendAccountOfficerRecoveryEmail(customer, amount, link, id);
        } else {
            throw new Error('Account officer has not entered the amount that can be recovered')
        }
    }

    console.log('account officer', accountOfficer)
    res
        .status(200)
        .json(
            {
                status: "success",
                message: 'Recovery request sent sucessfully',
                meta: {}
            })
})


const getAllStateWithRecoveryRequest = asyncHandler(async (req, res) => {
    const statement = await AnalysedStatement.find({ recoveryReequest: true }).populate('analysedBy')
    res
        .status(200)
        .json(
            {
                status: "success",
                message: 'All recovery request',
                data: statement,
                meta: {}
            })

})

const commenceStatementRecovery = asyncHandler(async (req, res) => {

    const statement = await AnalysedStatement.findOne({ key: Number(req.query.key) });
    const user = await User.findById({ _id: statement?.reportOwnerId })

    if (statement && user) {
        if (statement.analysedBy.toString() === req.user.id.toString()) {
            statement.dateAccountOfficerStartedRecovery = new Date();

            const amount = statement.amountThatCanBeRecouped;
            const id = statement.reportOwnerId;

            await sendUserRecoveryCommencementEmail(amount, id);

            await statement.save();

            return res
                .status(200)
                .json(
                    {
                        status: "success",
                        message: 'Recovery status updated succesfully',
                        meta: {}
                    })

        } else {
            throw new Error('You cannot commence the process of recovery because this report was not assigned to you')
        }

    } else {
        res
            .status(401)
            .json(
                {
                    status: "error",
                    meta: { error: "invalid request" }
                })
    }
})

const sendEmailToUser = asyncHandler(async (req, res) => {
    const { error, value } = sendEmailShema.validate(req.body);

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


    const { id, header, message } = value;
    await AccountOfficerToUserEmail(id, header, message);
    return res
        .status(200)
        .json(
            {
                status: "success",
                message: 'Message sent succesfully',
                meta: {}
            })

})



export {
    acceptStatementProcessing,
    statementReport,
    getAllAccountOfficersPendingReports,
    updateAnalysedStatementStatus,
    addStatusReport,
    getAllReports,
    getAllAccountOfficers,
    manualAssign,
    sendRecoveryRequest,
    getAllStateWithRecoveryRequest,
    commenceStatementRecovery,
    sendEmailToUser
}