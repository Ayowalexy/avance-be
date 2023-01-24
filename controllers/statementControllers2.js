import asyncHandler from "express-async-handler";
import axios from "axios";
import dotenv from "dotenv";
import useAxios from "../utils/apicall.js";
import User from '../models/usermodel.js'
import { automaticProcessingSchema, deleteBankAccountSchema } from "../utils/schema.js";
import Account from "../models/banksAccountModel.js";



dotenv.config()

const STATEMENT_URL = process.env.STATEMENT
const Client_ID = process.env.Client_ID
const MY_BANK_STATEMENT = process.env.MY_BANK_STATEMENT
const PERICULUM_BASE_URL = process.env.PERICULUM_AUDIENCE


const deletebankAccount = asyncHandler(async (req, res) => {

    const { id } = req.params

    await User.findByIdAndUpdate(req.user.id, { $pull: { bankAccounts: id } })
    await Account.findByIdAndDelete(id)

    res
        .status(401)
        .json(
            {
                status: "success",
                message: 'Account deleted successfully',
                meta: {}
            })

})

export {
    deletebankAccount
}