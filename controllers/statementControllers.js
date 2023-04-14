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
import generator from "../utils/generate-pdf-statement.js";
import { create_pdf } from "../utils/pdf.js";


const access_token_1 = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VSkJOVUk0UkRFek9FVTBORGd4UWpVMVJqTTJPVEJEUXpRMFF6bEJRa1F6UWpnd1JETkVSQSJ9.eyJodHRwczovL2luc2lnaHRzLXBlcmljdWx1bS5jb20vdGVuYW50IjoiYWxhZGRpbiIsImlzcyI6Imh0dHBzOi8vcGVyaWN1bHVtLXRlY2hub2xvZ2llcy1pbmMuYXV0aDAuY29tLyIsInN1YiI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2FwaS5pbnNpZ2h0cy1wZXJpY3VsdW0uY29tIiwiaWF0IjoxNjc0MzQ2Njk3LCJleHAiOjE2NzQ5NTE0OTcsImF6cCI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.TH1_KUdGNXeHhKO0kHSW_QCR56kPs-4MiNfqjri5BeIAm9XuRp9zTBs07FZRRR26P1q_4xJCVd2yjUDu1X2YRD0RiyvDuEjZKfQ2L51ruOL-gfklEqsFazn6xVtx8y4uWm0kBotbcXhNa7h3YgHIGkShw3SrMwYBFmQnupberkEhVlxb1oCCtPS4U8SbWZzyz62b4ik797dZN2qmWlBI4pMwF-N8x705KCzbyMv2V4XqavY7xkhBd6g_yAYCnT-Me1jwsjqPInRldcdnr1oqfK9I440E9rVOIZMvndysW60HabUcihjE4DPT8uJvQ9QufWBY55-kZAJgOZHmG0ouyA'
const access_token_2 = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VSkJOVUk0UkRFek9FVTBORGd4UWpVMVJqTTJPVEJEUXpRMFF6bEJRa1F6UWpnd1JETkVSQSJ9.eyJodHRwczovL2luc2lnaHRzLXBlcmljdWx1bS5jb20vdGVuYW50IjoiYWxhZGRpbiIsImlzcyI6Imh0dHBzOi8vcGVyaWN1bHVtLXRlY2hub2xvZ2llcy1pbmMuYXV0aDAuY29tLyIsInN1YiI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2FwaS5pbnNpZ2h0cy1wZXJpY3VsdW0uY29tIiwiaWF0IjoxNjc1MzQ3MTIxLCJleHAiOjE2NzU5NTE5MjEsImF6cCI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.LmQPUoJnZG3Pszytjb4XqUODCxtkvksej9_E5X7s10Yme2yBLiR7ARrr6pGpu0G8NhZCinJSKKBSl1Rvr84lqma1nh9CKMAmoXoJgSTbNlBjS5aawn_ErC4GvGY_YHh-Y8L97Lc4gqp7Z7la30Bm0L1sIwSlAaukZHA_aUqPSqr4_SdpLywFYjKAKPqvL4kwwVM_bAxfVHXbsld4j7Z_TCev2b-iOW5xaacuM2sNgqVpEI1jPdp9T_0Np9JqZrXGz33LloQY1G3YprhnHovXXPo2WH6QXBLOS_1HmafqOStGx3-5XR7ViamW5G7KbUUFCxeiLumjmA0oJGwYYyrrBg'
const access_token_3 = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VSkJOVUk0UkRFek9FVTBORGd4UWpVMVJqTTJPVEJEUXpRMFF6bEJRa1F6UWpnd1JETkVSQSJ9.eyJodHRwczovL2luc2lnaHRzLXBlcmljdWx1bS5jb20vdGVuYW50IjoiYWxhZGRpbiIsImlzcyI6Imh0dHBzOi8vcGVyaWN1bHVtLXRlY2hub2xvZ2llcy1pbmMuYXV0aDAuY29tLyIsInN1YiI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2FwaS5pbnNpZ2h0cy1wZXJpY3VsdW0uY29tIiwiaWF0IjoxNjc2MzYxMzA5LCJleHAiOjE2NzY5NjYxMDksImF6cCI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.VHzu7EJU0HZSqDT8DIgmOT0FHV7HdZa-u16jy6zZXrIdwB12uHlo3u3yMFNHYATWz2IOnMYabGHoIrtMa4GtJj2iYqjOBS9WKOA1-lsiAyGb3kdy6aTzVIEs8bZZXe9qvnbZupeOWKo3tMWkYeHF9Ug_iFkW7V-Y9mRKz-Yt40AXq2LAhX9iqYs9fwNtx2s3IiYqjzOWLM5vUyAObXP5xhJK2NlWMLjOaBfBsDX67sH1sQu5Mhik8AJMNDtACczVifpPeu8KNYO3nhUAdUjxHLry4jK9NVhenGA3owBZy0WL82xcHTfO3XR_AlWoQHvmPHKTCyKs1XNTF0IFKf9YPw'
const access_token_4 = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VSkJOVUk0UkRFek9FVTBORGd4UWpVMVJqTTJPVEJEUXpRMFF6bEJRa1F6UWpnd1JETkVSQSJ9.eyJodHRwczovL2luc2lnaHRzLXBlcmljdWx1bS5jb20vdGVuYW50IjoiYWxhZGRpbiIsImlzcyI6Imh0dHBzOi8vcGVyaWN1bHVtLXRlY2hub2xvZ2llcy1pbmMuYXV0aDAuY29tLyIsInN1YiI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2FwaS5pbnNpZ2h0cy1wZXJpY3VsdW0uY29tIiwiaWF0IjoxNjc3MzQwNzk5LCJleHAiOjE2Nzc5NDU1OTksImF6cCI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.Vb_2KCewinLYO8sZwueMY_7jmr7VlWlwqiHXk5q9Cawb4Cj8p5dH7bBhuZp8sW-UxVBnFp1pgz9oX_5ErkltCUb9hpnEbEZso7BkHufBKaY9kg4fz0OE01QM4aGkOIoQ0Yb41IbnyPRrs6CvelCHVa9IwwHw4zM50hrwyzkQP37kgvipew9uPjCostr1mWbj3MmdvSkVH3eEVZekbwndOiqka3hk4iiUpTUe_IXCPJE0X4jxE7TCeUD657LsJFWdGjYsEcYhhE7UYmhsEIxuhNitkrAKKl-PqPq9ao2NHXHxDC8oxqSiY3_-kPAz2GbzCRjfG_GjvgiOkvDfCwbCLw'
const access_token_5 = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VSkJOVUk0UkRFek9FVTBORGd4UWpVMVJqTTJPVEJEUXpRMFF6bEJRa1F6UWpnd1JETkVSQSJ9.eyJodHRwczovL2luc2lnaHRzLXBlcmljdWx1bS5jb20vdGVuYW50IjoiYWxhZGRpbiIsImlzcyI6Imh0dHBzOi8vcGVyaWN1bHVtLXRlY2hub2xvZ2llcy1pbmMuYXV0aDAuY29tLyIsInN1YiI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2FwaS5pbnNpZ2h0cy1wZXJpY3VsdW0uY29tIiwiaWF0IjoxNjc5MTI0MzEwLCJleHAiOjE2Nzk3MjkxMTAsImF6cCI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.ZSbu_Yv1UcUEpJs8t2epMr1WH5cR7ehVou2v2ijK-nKWwFHkDQ9U-vkZGnGqhgOtbYfz0pE016WQTZ2zU7FZHR2t8nyGuJD4uSjinCq2zOxlck1__U4SJ-P7XE5TCPjWTM6OFBhdbsWyObSq1nLcaX704zDp2rh8ArRTixBKzqbWjLdgJp3ZH3gH3UBTW5gBqbD31i2BN-WyuTCkwCsU_eTQexndhLBdWSB3Btit2sm7WWKUgZRXb46PicY_luSydgHc-HOMzYjCv1HWJaBCDO2QtZ9Q4a9uLkzWGKd6cQNe8Tp9S2UOfMfJUhGcRewQBv3kx3aHzXBkcvVUJ3hs3Q'
const access_token_6 = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VSkJOVUk0UkRFek9FVTBORGd4UWpVMVJqTTJPVEJEUXpRMFF6bEJRa1F6UWpnd1JETkVSQSJ9.eyJodHRwczovL2luc2lnaHRzLXBlcmljdWx1bS5jb20vdGVuYW50IjoiYWxhZGRpbiIsImlzcyI6Imh0dHBzOi8vcGVyaWN1bHVtLXRlY2hub2xvZ2llcy1pbmMuYXV0aDAuY29tLyIsInN1YiI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2FwaS5pbnNpZ2h0cy1wZXJpY3VsdW0uY29tIiwiaWF0IjoxNjc5NzM4MTM2LCJleHAiOjE2ODAzNDI5MzYsImF6cCI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.HkQKkmrSSsml1vt9gl0kaF_bwI46C89PJWwrFqYXLb5EZ4MGevYUl6WocNXEsA-1XLG2Fb9CuQo0hGPOAgh2n5XCO_U4CqVT07SRHGAlOVDJTicVey62KY3nFfunM4h1_KiMBo_WFwCNDpi--tCWtd10QxWsJvKlsEzJGK4_P9DChn2VszHB8m6VeJMdZF-xsek2zDv7INZzNQncqcurbYKBYJ45F6Z2ybhMFBW_DSd8ZAiJe3g8128njrXUvKWOHisXltYVmUrq80BfDiP3I0JQNw3HEnvZsnnA80cDZ7AgrQ9RtcvjJ_ECHoQ1Lllkv_IuPiVqzsC_ri3_Zb9LpA'
const access_token_7 = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VSkJOVUk0UkRFek9FVTBORGd4UWpVMVJqTTJPVEJEUXpRMFF6bEJRa1F6UWpnd1JETkVSQSJ9.eyJodHRwczovL2luc2lnaHRzLXBlcmljdWx1bS5jb20vdGVuYW50IjoiYWxhZGRpbiIsImlzcyI6Imh0dHBzOi8vcGVyaWN1bHVtLXRlY2hub2xvZ2llcy1pbmMuYXV0aDAuY29tLyIsInN1YiI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2FwaS5pbnNpZ2h0cy1wZXJpY3VsdW0uY29tIiwiaWF0IjoxNjgwNjg4OTgzLCJleHAiOjE2ODEyOTM3ODMsImF6cCI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.fEQuSKNicGLKTd7lB3WjkZvTFUKXkmyGLKhZuRr7w7lPJaOwSrpmrkSMTiElwPBJMxenUJ0KUwy42DHUraB2To4oV_gbSxdX7O3B40Ohv2JO34y4fq1crOD7lAbAx_6NYC31sHMMumlXj3itbuFAI8CvY-qakqtLzMRmoqkwPAO2gTS3c9FAimYUUailgIVD1xNRFbbaEGDdmw05CkPJwgV5CpAIJxtsyXjrvbP9l_02aBp3dUqRFex2DAvIjBOV0iw2fEAQmkrxY_WcECw4TLtj2UsuxcT5C3X5Y5Lcd5cmHvzBHRmlPQYAseDprn-UX8ENnJZqhTia8oasKlQm9Q'
const access_token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VSkJOVUk0UkRFek9FVTBORGd4UWpVMVJqTTJPVEJEUXpRMFF6bEJRa1F6UWpnd1JETkVSQSJ9.eyJodHRwczovL2luc2lnaHRzLXBlcmljdWx1bS5jb20vdGVuYW50IjoiYWxhZGRpbiIsImlzcyI6Imh0dHBzOi8vcGVyaWN1bHVtLXRlY2hub2xvZ2llcy1pbmMuYXV0aDAuY29tLyIsInN1YiI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2FwaS5pbnNpZ2h0cy1wZXJpY3VsdW0uY29tIiwiaWF0IjoxNjgxMDY4MzIxLCJleHAiOjE2ODE2NzMxMjEsImF6cCI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.Bx4qM_mw_NBIdh1-7qd2FFeOWWqEO2y8N2mzI2EP7NhC-RWjjkFdDzutNYyouR7ed1oqB35ox5TZMwcqmkFA1NtpJzGd5rDo_rTKvRnqCg3fjjFuzAID154vX5v7H6edIHQEjlw_wd7rso-q4ADtdwIbG1WUlgIMevv0KUddOwrObXkSp3sgVriG-T3_DhoKEKpVYczd2f5a9xe_DNHh9eaSB_GHDegh4cLE3awbfr6y15KWjVvwQalQzBRaT9EOReJWGznAp_wsLLQM9ZWPUHJNThQ0xWyBEH0Z_8N40qGABUMi_gDVV0Iujs3-fdA-KTZAUffnLTos7bUqNquIaA'


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
                    message: "We have sent your retrieved statements to our partners, we'll send you a feedback shortly",
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
        const statement = await AnalysedStatement.findOne({ key: data.key });


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


            if (statement) {
                hasUserPaidForInsight = statement.isPaid;
            }
        }

        if (!Boolean(statement?.reportLink)) {
            const spendAnalysis = data?.spendAnalysis;
            const transactionPatternAnalysis = data?.transactionPatternAnalysis;
            const behavioralAnalysis = data?.behavioralAnalysis
            const cashFlowAnalysis = data?.cashFlowAnalysis

            const spendAnalysisReport = {
                highestSpend: spendAnalysis.highestSpend,
                totalExpenses: spendAnalysis.totalExpenses,
                averageMonthlyTotalExpenses: spendAnalysis.averageMonthlyTotalExpenses,
                averageMonthlySpendOnAtmAndPOS: spendAnalysis.averageMonthlySpendOnAtmAndPOS,
                averageMonthlySpendOnAirtimeAndData: spendAnalysis.averageMonthlySpendOnAirtimeAndData,
                averageMonthlySpendOnChargesAndStampDuty: spendAnalysis.averageMonthlySpendOnChargesAndStampDuty,
                averageMonthlySpendOnEntertainment: spendAnalysis.averageMonthlySpendOnEntertainment,
                averageMonthlySpendOnOnlineAndWeb: spendAnalysis.averageMonthlySpendOnOnlineAndWeb,
                averageMonthlySpendOnOthers: spendAnalysis.averageMonthlySpendOnOthers,
                averageMonthlySpendOnTransfer: spendAnalysis.averageMonthlySpendOnTransfer,
                averageMonthlySpendOnUSSD: spendAnalysis.averageMonthlySpendOnUSSD,
                totalSpendOnAtmAndPOS: spendAnalysis.totalSpendOnAtmAndPOS,
                totalSpendOnAirtimeAndData: spendAnalysis.totalSpendOnAirtimeAndData,
                totalSpendOnChargesAndStampDuty: spendAnalysis.totalSpendOnChargesAndStampDuty,
                totalSpendOnEntertainment: spendAnalysis.totalSpendOnEntertainment,
                totalSpendOnOnlineAndWeb: spendAnalysis.totalSpendOnOnlineAndWeb,
                totalSpendOnOthers: spendAnalysis,
                totalSpendOnTransfer: spendAnalysis.totalSpendOnTransfer,
                totalSpendOnUSSD: spendAnalysis.totalSpendOnUSSD
            }

            const transactionpattern = {
                percentDebitTransactions: transactionPatternAnalysis.percentDebitTransactions * 100,
                percentCreditTransactions: transactionPatternAnalysis.percentCreditTransactions * 100,
                totalNumberOfTransactions: transactionPatternAnalysis.totalNumberOfTransactions,
                percentOfTransactionsLessThan10ThousandNaira: transactionPatternAnalysis.percentOfTransactionsLessThan10ThousandNaira * 100,
                percentOfTransactionsBetween10ThousandTo100ThousandNaira: transactionPatternAnalysis.percentOfTransactionsBetween10ThousandTo100ThousandNaira * 100,
                percentOfTransactionsBetween100ThousandTo500ThousandNaira: transactionPatternAnalysis.percentOfTransactionsBetween100ThousandTo500ThousandNaira * 100,
                percentOfTransactionsBetween500ThousandToOneMillionNaira: transactionPatternAnalysis.percentOfTransactionsBetween500ThousandToOneMillionNaira * 100,
                percentNumberOfDaysTransactionsWasLessThan10ThousandNaira: transactionPatternAnalysis.percentNumberOfDaysTransactionsWasLessThan10ThousandNaira * 100,
                percentOfBalancesLessThan10ThousandNaira: transactionPatternAnalysis.percentOfBalancesLessThan10ThousandNaira * 100,
                percentOfBalancesBetween10ThousandTo100ThousandNaira: transactionPatternAnalysis.percentOfBalancesBetween10ThousandTo100ThousandNaira * 100,
                percentOfBalancesBetween500ThousandToOneMillionNaira: transactionPatternAnalysis.percentOfBalancesBetween500ThousandToOneMillionNaira * 100,
                percentOfBalancesGreaterThanOneMillionNaira: transactionPatternAnalysis.percentOfBalancesGreaterThanOneMillionNaira * 100,
                percentNumberOfDaysBalanceWasLessThan10ThousandNaira: transactionPatternAnalysis.percentNumberOfDaysBalanceWasLessThan10ThousandNaira * 100,
                mostFrequentBalanceRange: transactionPatternAnalysis.mostFrequentBalanceRange,
                mostFrequentTransactionRange: transactionPatternAnalysis.mostFrequentTransactionRange
            }


            const behavioralAnalysisReport = {
                totalLoanRepaymentAmount: behavioralAnalysis.totalLoanRepaymentAmount,
                loanRepaymentToInflowRate: behavioralAnalysis.loanRepaymentToInflowRate * 100,
                numberLoanTransactions: behavioralAnalysis.numberLoanTransactions,
                totalLoanAmount: behavioralAnalysis.totalLoanAmount ? behavioralAnalysis.totalLoanAmount : 0,
                numberRepaymentTransactions: behavioralAnalysis.numberRepaymentTransactions,
                accountActivity: behavioralAnalysis.accountActivity * 100,
                gamblingRate: behavioralAnalysis.gamblingRate,
                overallInflowToOutflowRate: behavioralAnalysis.overallInflowToOutflowRate,
                accountSweep: behavioralAnalysis.accountSweep,
                percentOfInflowIrregularity: behavioralAnalysis.percentOfInflowIrregularity * 100,
                averageMonthlyLoanAmount: behavioralAnalysis.averageMonthlyLoanAmount,
            }


            const cashFlowAnalysisPattern = {
                validCredit: cashFlowAnalysis.validCredit,
                closingBalance: cashFlowAnalysis.closingBalance,
                percentageOfExpenseOverInflow: cashFlowAnalysis.percentageOfExpenseOverInflow * 100,
                totalCreditTurnover: cashFlowAnalysis.totalCreditTurnover,
                totalDebitTurnOver: cashFlowAnalysis.totalDebitTurnOver,
                averageMonthlyDebits: cashFlowAnalysis.averageMonthlyDebits,
                averageWeeklyCredits: cashFlowAnalysis.averageWeeklyCredits,
                averageMonthlyBalance: cashFlowAnalysis.averageMonthlyBalance,
                averageWeeklyBalance: cashFlowAnalysis.averageWeeklyBalance,
            }

            // const str_html = create_pdf(spendAnalysisReport, transactionpattern, cashFlowAnalysisPattern, behavioralAnalysisReport);
            // await generator(str_html, data.key)

        }
        const { type } = req.query
        console.log(data)
        const resData = data[type]
        const accountBalance = data?.accountBalance;

        let amountPayable = 0;
        if(accountBalance < 5000000000){
            amountPayable = Number(accountBalance) * 0.05
        } else if(accountBalance > 5000000000 && accountBalance < 25000000000){
            amountPayable = Number(accountBalance) * 0.025;
        } else if(accountBalance > 25000000000){
            amountPayable = Number(accountBalance) * 0.15;
        }

        return res
            .status(200)
            .json(
                {
                    status: 'success',
                    message: "Statement Retrieved successfully",
                    data: resData,
                    type,
                    amountPayable: Number(amountPayable) + 25000,
                    key: data.key,
                    hasUserPaidForInsight,
                    pdfUkl: 'http://res.cloudinary.com/dquiwka6j/image/upload/v1680949770/foo/waspujbwosmye8fh0nca.pdf',

                    // pdfUkl: statement.reportLink || 'http://res.cloudinary.com/dquiwka6j/image/upload/v1680949770/foo/waspujbwosmye8fh0nca.pdf',
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


    if (data.event === 'charge.success' && amount === 2500000) {
        const meta = data.data.metadata;
        const userId = meta.userId;
        const key = meta.key;
        const reference = data.data.reference

        const user = await User.findById(userId);
        console.log(user, key, 'here-0-')

        if (user && key) {
            await AnalysedStatement.findOneAndUpdate({ key }, { isPaid: true })
            const subscription = new Subscription({
                key,
                reference,
                amount
            })
            console.log('herer--')


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