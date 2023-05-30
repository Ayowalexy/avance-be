import AnalysedStatement from "../models/analysedStatement.js";
import asyncHandler from "express-async-handler";
import User from "../models/usermodel.js";
import { automaticProcessingSchema, confirmSchema } from "../utils/schema.js";
import dotenv from 'dotenv';
import { allBanksArray } from "../utilities/all-banks.js";
import { formarDate } from "../utils/dateFormat.js";
import useAxios from "../utils/apicall.js";
import periculumToken from "../utilities/periculum-access-token.js";
import StatementStatus from "../models/statement-status.js";
import { addMessageToQueue } from "../utils/queue.js";
import UniqueKey from "../models/unique-key.js";

dotenv.config()

const STATEMENT_URL = process.env.STATEMENT
const Client_ID = process.env.Client_ID
const MY_BANK_STATEMENT = process.env.MY_BANK_STATEMENT
const PERICULUM_BASE_URL = process.env.PERICULUM_AUDIENCE
const PAYSTACK_SK = process.env.PAYSTACK_SK
const UNIQUE_KEY_ID = process.env.UNIQUE_KEY_ID



const automateStatementAnalysis = asyncHandler(async (req, res) => {
    const { error, value } = automaticProcessingSchema.validate(req.body);

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
    const user = await User.findById(req.user.id);

    const applicants = [
        {
            name: user.firstName.concat(' ', user.lastName),
            applicationNo: ""
        }
    ]
    const data = {
        ...value,
        username: "musideen@aladdin.ng",
        destinationId: Number(Client_ID),
        applicants,
        country: 'NG',
        startDate: formarDate(value.startDate),
        endDate: formarDate(value.endDate)
    }

    try {
        const response = await useAxios({
            url: `${MY_BANK_STATEMENT}/RequestStatement`,
            method: "post",
            data: data
        });

        const stringify = JSON.stringify(data);

        //save user bank data in session;
        req.session.bankDetails = stringify;

        return res
            .status(200)
            .json(
                {
                    ...response?.data,
                    status: 'success',
                    message: "Instructions will be sent to your phone numer shortly",
                    meta: {}
                })
    } catch (e) {
        console.log(e.response)
        res.status(401).json({ "status": "error", "message": "invalid error", "meta": { "error": "provider not available" } })

    }

})


const confirmAutomaticCredentials = asyncHandler(async (req, res) => {

    const { error, value } = confirmSchema.validate(req.body);

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

    try {

        const user = await User.findById(req.user.id).populate({
            path: 'analyzedStatements',
            populate: {
                path: 'statementStatus',
            }
        })

        const requestId = req.params.key;

        const doesReportIdExits = user.analyzedStatements.find(ele => Number(ele?.key) === Number(requestId));
        if (doesReportIdExits) {
            // throw new Error(`Statement with ${requestId} is already analysed`);
        }

        const confirmStatement = await useAxios({
            url: `${MY_BANK_STATEMENT}/ConfirmStatement`,
            method: 'post',
            data: value
        })
        console.log(confirmStatement.data, 'confirmStatement')

        if (confirmStatement.data?.status === '00') {

            setTimeout(async () => {

                console.log(req.session, 'session')
                const userBankDetails = req.session.bankDetails;
                const parsed = JSON.parse(userBankDetails);

                //live url
                const currentUniqueKey = await UniqueKey.findById('6460b210f346e27a3aa77b34');
                // const currentUniqueKey = await UniqueKey.findById(UNIQUE_KEY_ID);

                const unique = currentUniqueKey.uniqueKey;
                const userFullName = user.firstName.concat(' ', user.lastName);


                const {
                    bankName = '',
                    accountNo = '',
                    ticketNo = value.ticketNo,
                    pwd = value.password,
                    uniqueKey = unique,
                    bankId,
                    phone,
                    name = userFullName,
                    startDate,
                    endDate
                } = parsed;

                currentUniqueKey.uniqueKey = Number(unique) + 1;
                await currentUniqueKey.save();

                const matchingBank = allBanksArray.find(ele => ele.name.toLowerCase()?.includes(bankName.toLowerCase().trim()));

                const account = {
                    name: matchingBank?.name || bankName,
                    accountNo: accountNo,
                    bankImg: matchingBank?.logo || '',
                    createdAt: new Date()
                }

                //initialized statement status with default automatic message
                const statementStatus = new StatementStatus({
                    message: 'Your have successfully retrieved your statement automatically',
                    status: 'pending'
                })

                await statementStatus.save();

                const analysedStatement = new AnalysedStatement({
                    status: 'pending',
                    reportOwnerId: req.user.id,
                    statementRecoveryType: 'automatic',
                    account,
                    user: req.user,
                    // reportId: requestId,
                    uniqueKey: unique,
                    key: requestId,
                    automatickTicketId: value.ticketNo,
                    bankStatementPassword: value.password
                })

                analysedStatement.statementStatus.push(statementStatus);

                await analysedStatement.save();
                user.analyzedReports = Number(user.analyzedReports) + 1;
                user.analyzedStatements.push(analysedStatement);

                await user.save();

                const payload = {
                    ticketNo,
                    pwd,
                    accountNo,
                    uniqueKey,
                    bankId,
                    phone,
                    name,
                    startDate,
                    endDate,
                    id: user._id.toString()
                }

                const queueResp = await addMessageToQueue(payload);

                console.log(queueResp)

                return res
                    .status(200)
                    .json(
                        {
                            message: "statement is being processed",
                            status: 'success',
                            meta: {}
                        })
            }, 60000);
        } else {
            res.status(401).json({ "status": "error", "message": "invalid error", "meta": { "error": error } })
        }
    } catch (e) {
        const error = e?.response?.data?.message || e.toString() || "provider not available"
        console.log(e)
        res.status(401).json({ "status": "error", "message": "invalid error", "meta": { "error": error } })
    }
})


const getAutomaticProcessingStatus = asyncHandler(async (req, res) => {

    const requestId = req.query.key;
    try {

        const feedback = await useAxios({
            url: `${MY_BANK_STATEMENT}/GetFeedbackByRequestID`,
            method: 'post',
            data: { requestId }
        })

        const status = feedback?.data?.result?.status;
        console.log(feedback.data)
        res
            .status(200)
            .json(
                {
                    message: "statement is being processed",
                    status: 'success',
                    meta: {}
                })
    } catch (e) {
        console.log(e.response.data.message)
        const error = e.response.data.message || 'An error occured';
        res.status(401).json({ "status": "error", "message": "invalid error", "meta": { "error": error } })
    }

})


const getAutomaticStatementAnalysis = asyncHandler(async (req, res) => {
    const key = req.query.key;
    const type = req.query.type;

    let statement = await AnalysedStatement.findOne({ key });


    if (statement.length) {
        // statement = statement.length > 1 ? statement[statement.length - 1] : statement[0];
        if (statement.analysed) {
            const val = statement[type];
            const creditTurnOver = statement?.cashFlowAnalysis?.totalCreditTurnover

            let amountPayable = 0;
            if (creditTurnOver < 5000000000) {
                amountPayable = Number(creditTurnOver) * 0.05
            } else if (creditTurnOver > 5000000000 && creditTurnOver < 25000000000) {
                amountPayable = Number(creditTurnOver) * 0.025;
            } else if (creditTurnOver > 25000000000) {
                amountPayable = Number(creditTurnOver) * 0.15;
            }
            const rate = creditTurnOver < 5000000000 ? '0.05%' : creditTurnOver > 5000000000 && creditTurnOver < 25000000000 ? '0.025%' : creditTurnOver > 25000000000 ? '0.15%' : ''

            return res
                .status(200)
                .json(
                    {
                        status: 'success',
                        message: "Statement has been proceed and report now available",
                        type,
                        data: val,
                        amountPayable: Number(amountPayable) + 25000,
                        rate,
                        creditTurnOver,
                        meta: {}
                    })

        } else {
            return res
                .status(401)
                .json(
                    {
                        status: 'error',
                        message: "Report for this statement is still being processed",
                        meta: {}
                    })
        }
    } else {
        res.status(401).json({ "status": "error", "message": "invalid error", "meta": { "error": `Statement with ${reportId} not found` } })
    }
})

export {
    automateStatementAnalysis,
    confirmAutomaticCredentials,
    getAutomaticProcessingStatus,
    getAutomaticStatementAnalysis
}