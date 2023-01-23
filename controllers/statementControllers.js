import asyncHandler from "express-async-handler";
import axios from "axios";
import dotenv from "dotenv";
import useAxios from "../utils/apicall.js";
import User from '../models/usermodel.js'
import moment from "moment/moment.js";
import { formarDate } from "../utils/dateFormat.js";
import { automaticProcessingSchema, confirmSchema } from "../utils/schema.js";
import getPericulumAccessToken from "../utils/periculumAccessToken.js";

dotenv.config()

const STATEMENT_URL = process.env.STATEMENT
const Client_ID = process.env.Client_ID
const MY_BANK_STATEMENT = process.env.MY_BANK_STATEMENT
const PERICULUM_BASE_URL = process.env.PERICULUM_AUDIENCE


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



    const user = await User.findById(req.user.id);

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

        try {
            const response = await useAxios({
                url: `${MY_BANK_STATEMENT}/RequestStatement`,
                method: "post",
                data: data
            });

            user.requestId = response.data.result;

            await user.save();

            return res
                .status(200)
                .json(
                    {
                        ...response?.data,
                        status: 'success',
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
                // const access_token = token.access_token;
                const access_token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VSkJOVUk0UkRFek9FVTBORGd4UWpVMVJqTTJPVEJEUXpRMFF6bEJRa1F6UWpnd1JETkVSQSJ9.eyJodHRwczovL2luc2lnaHRzLXBlcmljdWx1bS5jb20vdGVuYW50IjoiYWxhZGRpbiIsImlzcyI6Imh0dHBzOi8vcGVyaWN1bHVtLXRlY2hub2xvZ2llcy1pbmMuYXV0aDAuY29tLyIsInN1YiI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2FwaS5pbnNpZ2h0cy1wZXJpY3VsdW0uY29tIiwiaWF0IjoxNjc0MzQ2Njk3LCJleHAiOjE2NzQ5NTE0OTcsImF6cCI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.TH1_KUdGNXeHhKO0kHSW_QCR56kPs-4MiNfqjri5BeIAm9XuRp9zTBs07FZRRR26P1q_4xJCVd2yjUDu1X2YRD0RiyvDuEjZKfQ2L51ruOL-gfklEqsFazn6xVtx8y4uWm0kBotbcXhNa7h3YgHIGkShw3SrMwYBFmQnupberkEhVlxb1oCCtPS4U8SbWZzyz62b4ik797dZN2qmWlBI4pMwF-N8x705KCzbyMv2V4XqavY7xkhBd6g_yAYCnT-Me1jwsjqPInRldcdnr1oqfK9I440E9rVOIZMvndysW60HabUcihjE4DPT8uJvQ9QufWBY55-kZAJgOZHmG0ouyA'

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
    console.log(req.file)

    const access_token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VSkJOVUk0UkRFek9FVTBORGd4UWpVMVJqTTJPVEJEUXpRMFF6bEJRa1F6UWpnd1JETkVSQSJ9.eyJodHRwczovL2luc2lnaHRzLXBlcmljdWx1bS5jb20vdGVuYW50IjoiYWxhZGRpbiIsImlzcyI6Imh0dHBzOi8vcGVyaWN1bHVtLXRlY2hub2xvZ2llcy1pbmMuYXV0aDAuY29tLyIsInN1YiI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2FwaS5pbnNpZ2h0cy1wZXJpY3VsdW0uY29tIiwiaWF0IjoxNjc0MzQ2Njk3LCJleHAiOjE2NzQ5NTE0OTcsImF6cCI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.TH1_KUdGNXeHhKO0kHSW_QCR56kPs-4MiNfqjri5BeIAm9XuRp9zTBs07FZRRR26P1q_4xJCVd2yjUDu1X2YRD0RiyvDuEjZKfQ2L51ruOL-gfklEqsFazn6xVtx8y4uWm0kBotbcXhNa7h3YgHIGkShw3SrMwYBFmQnupberkEhVlxb1oCCtPS4U8SbWZzyz62b4ik797dZN2qmWlBI4pMwF-N8x705KCzbyMv2V4XqavY7xkhBd6g_yAYCnT-Me1jwsjqPInRldcdnr1oqfK9I440E9rVOIZMvndysW60HabUcihjE4DPT8uJvQ9QufWBY55-kZAJgOZHmG0ouyA'

    // console.log('token', access_token)

    try {
        const periculum = await axios(`${PERICULUM_BASE_URL}`, {
            method: 'post',
            headers: {
                "Content-Type": "application/multipart/form-data",
                "Authorization": `Bearer ${access_token}`
            },
            data: {
                "file": req.file,
                "password": `0739676183`,
                "statementType": "consumer"
            }

        })

        console.log(periculum.data)
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
})


export {
    getListOfAvailableBanks,
    automateStatements,
    confirmChargeCustomer,
    getStatementStatus,
    getPdfStatement,
    manualStatement
}