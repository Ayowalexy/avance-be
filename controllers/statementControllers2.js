import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import User from '../models/usermodel.js'
import Account from "../models/banksAccountModel.js";


dotenv.config()


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