import asyncHandler from "express-async-handler";
import axios from "axios";
import dotenv from "dotenv";
import useAxios from "../utils/apicall.js";
import { automaticProcessingSchema } from "../utils/schema.js";

dotenv.config()

const STATEMENT_URL = process.env.STATEMENT
const Client_ID = process.env.Client_ID
const MY_BANK_STATEMENT = process.env.MY_BANK_STATEMENT


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

    const data = {
        ...value,
        username: "musideen@aladdin.ng",
        destinationId: Number(Client_ID),
        phone: '08145405006'
    }

    try {
        const response = await useAxios({
            url: `${MY_BANK_STATEMENT}/RequestStatement`,
            method: "post",
            data: data
        });


        res
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



})


export {
    getListOfAvailableBanks,
    automateStatements
}