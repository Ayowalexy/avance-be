import asyncHandler from "express-async-handler";
import axios from "axios";
import dotenv from "dotenv";
import useAxios from "../utils/apicall.js";
import User from '../models/usermodel.js'
import moment from "moment/moment.js";
import { formarDate } from "../utils/dateFormat.js";
import { automaticProcessingSchema, confirmSchema } from "../utils/schema.js";
import Customer from "../models/customerParameters.js";
import { addMessageToQueue } from "../utils/queue.js";
import FormData from "form-data";
import getPericulumAccessToken from "../utils/periculumAccessToken.js";
import { getAllBanks, } from "../utils/utils.js";
import crypto from 'crypto'
import Subscription from "../models/statementSubscription.js";
import Account from "../models/banksAccountModel.js";
import AnalysedStatement from "../models/analysedStatement.js";
import { sendAccountOfficerEmailOfNewSignmentInsight } from "../utils/sendAccountOfficerInsightEmail.js";
import { banks } from "../utils/banks.js";


const access_token_1 = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VSkJOVUk0UkRFek9FVTBORGd4UWpVMVJqTTJPVEJEUXpRMFF6bEJRa1F6UWpnd1JETkVSQSJ9.eyJodHRwczovL2luc2lnaHRzLXBlcmljdWx1bS5jb20vdGVuYW50IjoiYWxhZGRpbiIsImlzcyI6Imh0dHBzOi8vcGVyaWN1bHVtLXRlY2hub2xvZ2llcy1pbmMuYXV0aDAuY29tLyIsInN1YiI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2FwaS5pbnNpZ2h0cy1wZXJpY3VsdW0uY29tIiwiaWF0IjoxNjc0MzQ2Njk3LCJleHAiOjE2NzQ5NTE0OTcsImF6cCI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.TH1_KUdGNXeHhKO0kHSW_QCR56kPs-4MiNfqjri5BeIAm9XuRp9zTBs07FZRRR26P1q_4xJCVd2yjUDu1X2YRD0RiyvDuEjZKfQ2L51ruOL-gfklEqsFazn6xVtx8y4uWm0kBotbcXhNa7h3YgHIGkShw3SrMwYBFmQnupberkEhVlxb1oCCtPS4U8SbWZzyz62b4ik797dZN2qmWlBI4pMwF-N8x705KCzbyMv2V4XqavY7xkhBd6g_yAYCnT-Me1jwsjqPInRldcdnr1oqfK9I440E9rVOIZMvndysW60HabUcihjE4DPT8uJvQ9QufWBY55-kZAJgOZHmG0ouyA'
const access_token_2 = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VSkJOVUk0UkRFek9FVTBORGd4UWpVMVJqTTJPVEJEUXpRMFF6bEJRa1F6UWpnd1JETkVSQSJ9.eyJodHRwczovL2luc2lnaHRzLXBlcmljdWx1bS5jb20vdGVuYW50IjoiYWxhZGRpbiIsImlzcyI6Imh0dHBzOi8vcGVyaWN1bHVtLXRlY2hub2xvZ2llcy1pbmMuYXV0aDAuY29tLyIsInN1YiI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2FwaS5pbnNpZ2h0cy1wZXJpY3VsdW0uY29tIiwiaWF0IjoxNjc1MzQ3MTIxLCJleHAiOjE2NzU5NTE5MjEsImF6cCI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.LmQPUoJnZG3Pszytjb4XqUODCxtkvksej9_E5X7s10Yme2yBLiR7ARrr6pGpu0G8NhZCinJSKKBSl1Rvr84lqma1nh9CKMAmoXoJgSTbNlBjS5aawn_ErC4GvGY_YHh-Y8L97Lc4gqp7Z7la30Bm0L1sIwSlAaukZHA_aUqPSqr4_SdpLywFYjKAKPqvL4kwwVM_bAxfVHXbsld4j7Z_TCev2b-iOW5xaacuM2sNgqVpEI1jPdp9T_0Np9JqZrXGz33LloQY1G3YprhnHovXXPo2WH6QXBLOS_1HmafqOStGx3-5XR7ViamW5G7KbUUFCxeiLumjmA0oJGwYYyrrBg'
const access_token_3 = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VSkJOVUk0UkRFek9FVTBORGd4UWpVMVJqTTJPVEJEUXpRMFF6bEJRa1F6UWpnd1JETkVSQSJ9.eyJodHRwczovL2luc2lnaHRzLXBlcmljdWx1bS5jb20vdGVuYW50IjoiYWxhZGRpbiIsImlzcyI6Imh0dHBzOi8vcGVyaWN1bHVtLXRlY2hub2xvZ2llcy1pbmMuYXV0aDAuY29tLyIsInN1YiI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2FwaS5pbnNpZ2h0cy1wZXJpY3VsdW0uY29tIiwiaWF0IjoxNjc2MzYxMzA5LCJleHAiOjE2NzY5NjYxMDksImF6cCI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.VHzu7EJU0HZSqDT8DIgmOT0FHV7HdZa-u16jy6zZXrIdwB12uHlo3u3yMFNHYATWz2IOnMYabGHoIrtMa4GtJj2iYqjOBS9WKOA1-lsiAyGb3kdy6aTzVIEs8bZZXe9qvnbZupeOWKo3tMWkYeHF9Ug_iFkW7V-Y9mRKz-Yt40AXq2LAhX9iqYs9fwNtx2s3IiYqjzOWLM5vUyAObXP5xhJK2NlWMLjOaBfBsDX67sH1sQu5Mhik8AJMNDtACczVifpPeu8KNYO3nhUAdUjxHLry4jK9NVhenGA3owBZy0WL82xcHTfO3XR_AlWoQHvmPHKTCyKs1XNTF0IFKf9YPw'
const access_token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VSkJOVUk0UkRFek9FVTBORGd4UWpVMVJqTTJPVEJEUXpRMFF6bEJRa1F6UWpnd1JETkVSQSJ9.eyJodHRwczovL2luc2lnaHRzLXBlcmljdWx1bS5jb20vdGVuYW50IjoiYWxhZGRpbiIsImlzcyI6Imh0dHBzOi8vcGVyaWN1bHVtLXRlY2hub2xvZ2llcy1pbmMuYXV0aDAuY29tLyIsInN1YiI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2FwaS5pbnNpZ2h0cy1wZXJpY3VsdW0uY29tIiwiaWF0IjoxNjc3MzQwNzk5LCJleHAiOjE2Nzc5NDU1OTksImF6cCI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.Vb_2KCewinLYO8sZwueMY_7jmr7VlWlwqiHXk5q9Cawb4Cj8p5dH7bBhuZp8sW-UxVBnFp1pgz9oX_5ErkltCUb9hpnEbEZso7BkHufBKaY9kg4fz0OE01QM4aGkOIoQ0Yb41IbnyPRrs6CvelCHVa9IwwHw4zM50hrwyzkQP37kgvipew9uPjCostr1mWbj3MmdvSkVH3eEVZekbwndOiqka3hk4iiUpTUe_IXCPJE0X4jxE7TCeUD657LsJFWdGjYsEcYhhE7UYmhsEIxuhNitkrAKKl-PqPq9ao2NHXHxDC8oxqSiY3_-kPAz2GbzCRjfG_GjvgiOkvDfCwbCLw'


dotenv.config()

const STATEMENT_URL = process.env.STATEMENT
const Client_ID = process.env.Client_ID
const MY_BANK_STATEMENT = process.env.MY_BANK_STATEMENT
const PERICULUM_BASE_URL = process.env.PERICULUM_AUDIENCE
const PAYSTACK_SK = process.env.PAYSTACK_SK


const getListOfAvailableBanks = asyncHandler(async (req, res) => {

    try {
        const response = await useAxios({
            url: `${STATEMENT_URL}/SelectActiveRequestBanks`,
            method: "post",
        });

        res
            .status(200)
            .json(
                {
                    status: "success",
                    data: response?.data?.result,
                    meta: {}
                })
    } catch (e) {
        console.log(e)
        res.status(401).json({ "status": "error", "message": "invalid error", "meta": { "error": "provider not available" } })

    }
})


const automateStatements = asyncHandler(async (req, res) => {

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



    const user = await User.findById(req.user.id).populate("bankAccounts")

    if (user) {
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

        const customer = new Customer(data)


        try {
            const response = await useAxios({
                url: `${MY_BANK_STATEMENT}/RequestStatement`,
                method: "post",
                data: data
            });

            const bank = await getAllBanks(value.bankName)

            const userHasAlreadyAddedBankAccount = user.bankAccounts.some(bank => bank.accountNumber === value.accountNo);

            if (!userHasAlreadyAddedBankAccount) {
                const bankData = {
                    bankName: value.bankName,
                    accountNumber: value.accountNo,
                    bankLogo: bank.logo,
                    status: "Ongoing"
                }

                const newAccount = new Account(bankData)
                await newAccount.save();
                user.bankAccounts.push(newAccount)
            }

            user.requestId = response.data.result;

            await customer.save();
            user.customer = customer;
            await user.save();

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
            console.log(e)
            res.status(401).json({ "status": "error", "message": "invalid error", "meta": { "error": "provider not available" } })

        }
    } else {
        res.status(401).json({ "status": "error", "message": "invalid error", "meta": { "error": "user not found" } })

    }
})


const confirmChargeCustomer = asyncHandler(async (req, res) => {

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

        const user = await User.findById(req.user.id)
        const requestId = user.requestId;
        user.ticketId = value.ticketNo;

        const response = await useAxios({
            url: `${MY_BANK_STATEMENT}/ConfirmStatement`,
            method: 'post',
            data: value
        })

        const feedback = await useAxios({
            url: `${MY_BANK_STATEMENT}/GetFeedbackByRequestID`,
            method: 'post',
            data: { requestId }
        })

        const status = feedback?.data?.result?.status;

        if (status?.includes('Confirm')) {
            user.ticketStatus = "verified"

        } else if (status?.includes('Pending')) {
            user.ticketStatus = 'pending'
        }

        await user.save();

        const queueResp = await addMessageToQueue(value.ticketNo, value.password, user._id.toString());

        console.log(queueResp)

        return res
            .status(200)
            .json(
                {
                    ...feedback.data,
                    status: 'success',
                    meta: {}
                })

    } catch (e) {
        const error = e?.response?.data?.message || "provider not available"
        console.log(e)
        res.status(401).json({ "status": "error", "message": "invalid error", "meta": { "error": error } })
    }


})


const getStatementStatus = asyncHandler(async (req, res) => {


    const user = await User.findById(req.user.id);

    if (user) {
        const requestId = user.requestId;
        try {
            const response = await useAxios({
                url: `${MY_BANK_STATEMENT}/GetFeedbackByRequestID`,
                method: 'post',
                data: { requestId }
            })

            const status = response?.data?.result?.status

            if (status?.includes('Ticket') || status?.includes('Sent')) {
                user.ticketStatus = "sent"
            } else if (status?.includes('Pending')) {
                user.ticketStatus = 'pending'
            }
            await user.save();

            return res
                .status(200)
                .json(
                    {
                        ...response.data,
                        status: 'success',
                        meta: {}
                    })

        } catch (e) {
            res.status(401).json({ "status": "error", "message": "invalid error", "meta": { "error": "provider not available" } })
        }
    }
})


const getPdfStatement = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id);
    if (user) {

        const ticketNo = user.ticketId;

        try {
            const response = await useAxios({
                url: `${MY_BANK_STATEMENT}/GetPDFStatement`,
                method: 'post',
                data: { ticketNo }
            })

            if (response?.data?.message === 'Successful') {
                // const token = await getPericulumAccessToken();
                // console.log(token)
                // const access_token = token.access_token;
                const access_token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VSkJOVUk0UkRFek9FVTBORGd4UWpVMVJqTTJPVEJEUXpRMFF6bEJRa1F6UWpnd1JETkVSQSJ9.eyJodHRwczovL2luc2lnaHRzLXBlcmljdWx1bS5jb20vdGVuYW50IjoiYWxhZGRpbiIsImlzcyI6Imh0dHBzOi8vcGVyaWN1bHVtLXRlY2hub2xvZ2llcy1pbmMuYXV0aDAuY29tLyIsInN1YiI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2FwaS5pbnNpZ2h0cy1wZXJpY3VsdW0uY29tIiwiaWF0IjoxNjc3MzQwNzk5LCJleHAiOjE2Nzc5NDU1OTksImF6cCI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.Vb_2KCewinLYO8sZwueMY_7jmr7VlWlwqiHXk5q9Cawb4Cj8p5dH7bBhuZp8sW-UxVBnFp1pgz9oX_5ErkltCUb9hpnEbEZso7BkHufBKaY9kg4fz0OE01QM4aGkOIoQ0Yb41IbnyPRrs6CvelCHVa9IwwHw4zM50hrwyzkQP37kgvipew9uPjCostr1mWbj3MmdvSkVH3eEVZekbwndOiqka3hk4iiUpTUe_IXCPJE0X4jxE7TCeUD657LsJFWdGjYsEcYhhE7UYmhsEIxuhNitkrAKKl-PqPq9ao2NHXHxDC8oxqSiY3_-kPAz2GbzCRjfG_GjvgiOkvDfCwbCLw'
                // console.log('token', access_token)

                const periculum = await axios(`${PERICULUM_BASE_URL}`, {
                    method: 'post',
                    headers: {
                        "Content-Type": "application/multipart/form-data",
                        "Authorization": `Bearer ${access_token}`
                    },
                    data: {
                        "file": response?.data?.result,
                        "password": `${process.env.PWD}`,
                        "statementType": "consumer"
                    }

                })

                console.log(periculum.data)
            }
            return res
                .status(200)
                .json(
                    {
                        // ...response.data,
                        status: 'success',
                        message: "We have sent your retrieved statements to our partners, we're sent your a feedback shortly",
                        meta: {}
                    })

        } catch (e) {
            console.log(e.response)
            res.status(401).json({ "status": "error", "message": "invalid error", "meta": { "error": "provider not available" } })
        }

    }
})


const manualStatement = asyncHandler(async (req, res) => {


    const user = await User.findById(req.user.id);

    const form = new FormData()

    console.log(req.file)

    form.append("password", req.body.password)
    form.append("file", req.file.buffer, req.file.originalname)
    form.append("statementType", "consumer")


    try {
        const periculum = await axios.put(`${PERICULUM_BASE_URL}/statements`, form, {
            headers: {
                "Authorization": `Bearer ${access_token}`,
                ...form.getHeaders(),
            }
        })

        user.statementProcessingStatus = periculum?.data?.processingStatus;
        user.statementKey = periculum?.data?.key
        user.analyzedReports = Number(user.analyzedReports) + 1
        await user.save();

        return res
            .status(200)
            .json(
                {
                    status: 'success',
                    message: "We have sent your retrieved statements to our partners, we'll send your a feedback shortly",
                    meta: {}
                })
    } catch (e) {
        console.log(e.response.data)
        const error = e?.response?.data?.message || "provider not available"
        res.status(400).json({ "status": "error", "message": "invalid error", "meta": { "error": error } })

    }
})


const getStatementAnalytics = asyncHandler(async (req, res) => {


    const user = await User.findById(req.user.id)
        .populate("paidInsights")
        .populate('analyzedStatements')


    const statementKey = user.statementKey;



    try {
        const response = await axios(`${PERICULUM_BASE_URL}/statements/${statementKey}`, {
            headers: {
                "Authorization": `Bearer ${access_token}`,
                "Content-Type": "application/json"
            },
            method: 'get'
        })

        const data = response.data;

        let hasUserPaidForInsight = false;

        console.log(hasUserPaidForInsight)

        const userHasAddedReport = user?.analyzedStatements?.some(ele => ele.report.key === data.key)
        // const hasUserPaidForInsight = user.paidInsights.some(ele => ele.key === data.key);
        if (!userHasAddedReport) {
            const newStatement = new AnalysedStatement({
                report: data,
                key: data.key,
                reportOwnerId: user._id.toString()
            })

            await newStatement.save();

            // if user has not added report, that means they have not paid for the insight
            hasUserPaidForInsight = false;

            // user.analyzedStatements.push(newStatement);
            await User.findOneAndUpdate({ _id: req.user.id }, {
                $push: { analyzedStatements: newStatement }
            })

            await user.save();

        } else {
            const statement = await AnalysedStatement.findOne({ key: data.key });

            if (statement) {
                hasUserPaidForInsight = statement.isPaid;
            }
        }

        const { type } = req.query
        console.log(data)
        const resData = data[type]

        return res
            .status(200)
            .json(
                {
                    status: 'success',
                    message: "Statement Retrieved successfully",
                    data: resData,
                    type,
                    key: data.key,
                    hasUserPaidForInsight,
                    meta: {}
                })
    } catch (e) {
        console.log(e)
        const error = e?.response?.data?.message || "provider not available"
        res.status(400).json({ "status": "error", "message": "invalid error", "meta": { "error": error } })
    }
})


const statementWebhook = asyncHandler(async (req, res) => {
    console.log(req.body)
    res.sendStatus(200)
})


const insightPaymentWebhook = asyncHandler(async (req, res) => {

    // const hash = crypto.createHmac('sha512', PAYSTACK_SK).update(JSON.stringify(req.body)).digest('hex');
    // if (hash == req.headers['x-paystack-signature']) {
    //     const event = req.body;

    // }
    const data = req.body;
    const amount = data?.data?.amount;

    if (data.event === 'charge.success' && amount === 25000) {
        const meta = data.data.metadata;
        const userId = meta.userId;
        const key = meta.key;
        const reference = data.data.reference

        const user = await User.findById(userId);

        if (user && key) {
            await AnalysedStatement.findOneAndUpdate({ key }, { isPaid: true })
            const subscription = new Subscription({
                key,
                reference,
                amount
            })

            await subscription.save();
            // user.paidInsights.push(subscription);
            // await user.save();
            await User.findOneAndUpdate({ _id: userId }, {
                $push: { paidInsights: subscription }
            })
            await sendAccountOfficerEmailOfNewSignmentInsight(key)
        }
    }
    res.sendStatus(200);
})

const getManualBanks = asyncHandler(async (req, res) => {
    res.status(200).json(
        {
            status: 'success',
            message: "Statement Retrieved successfully",
            data: banks,
            meta: {}
        })
})


export {
    getListOfAvailableBanks,
    automateStatements,
    confirmChargeCustomer,
    getStatementStatus,
    getPdfStatement,
    manualStatement,
    statementWebhook,
    getStatementAnalytics,
    insightPaymentWebhook,
    getManualBanks
}