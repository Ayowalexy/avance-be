import BusinessDevelopers from "../../models/business-developers.js";
import asyncHandler from "express-async-handler";
import { changePasswordShema, createBusinessDeveloperSchema, loginSchema } from "../../utils/schema.js";
import sendBDAccountSetupEmail from "../../utils/email/bd/account-creation.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import User from "../../models/usermodel.js";
import AnalysedStatement from "../../models/analysedStatement.js";
import AccountOfficer from "../../models/accountOfficerModel.js";


dotenv.config();

const { sign, verify } = jwt;


const createNewBDAccount = asyncHandler(async (req, res) => {
    const { error, value } = createBusinessDeveloperSchema.validate(req.body);
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

    const password = Math.floor(Math.random() * 10000000);
    const hash = await bcrypt.hashSync(password.toString(), 12);
    const newDBAccount = new BusinessDevelopers({ ...value, password: hash })
    await newDBAccount.save();
    await sendBDAccountSetupEmail(value.email, value.fullName, password)
    res
        .status(200)
        .json(
            {
                status: 'success',
                message: "Account created successfully",
                meta: {}
            })
})

const login = asyncHandler(async (req, res) => {
    const { error, value } = loginSchema.validate(req.body);
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

    const user = await BusinessDevelopers.findOne({ email: value.email });
    if (user) {
        const match = await bcrypt.compareSync(value.password.toString(), user.password);
        if (match) {
            const token = sign({ email: user.email, id: user._id.toString() }, process.env.SECRET);
            const data = {
                fullName: user.fullName,
                email: user.email,
                isUpadated: user.isUpdated,
                phoneNumber: user.phoneNumber
            }
            res
                .status(200)
                .json(
                    {
                        status: 'success',
                        message: "Authentication successful",
                        data,
                        token,
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
                            error: 'Email or password does not match'
                        }
                    })
        }
    } else {
        res
            .status(403)
            .json(
                {
                    status: "error",
                    message: "invalid request",
                    meta: {
                        error: 'User not found'
                    }
                })
    }
})


const changePassword = (asyncHandler(async (req, res) => {
    const { error, value } = changePasswordShema.validate(req.body);
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

    const match = await bcrypt.compareSync(value.password.toString(), req.user.password);
    if (match) {
        const hash = await bcrypt.hashSync(value.new_password, 12);

        await BusinessDevelopers.findOneAndUpdate({ _id: req.user._id.toString() }, { password: hash, isUpadated: true });
        res
            .status(200)
            .json(
                {
                    status: 'success',
                    message: "Password updated successfully",
                    meta: {}
                })

    } else {
        return res
            .status(401)
            .json(
                {
                    status: "error",
                    message: "invalid request",
                    meta: {
                        error: "Password does not match"
                    }
                })
    }


}))


const getUserDetails = asyncHandler(async (req, res) => {

    const user = await BusinessDevelopers.findById(req.user._id);
    const data = {
        email: user.email,
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
        isUpdated: user.isUpdated
    }
    res
        .status(200)
        .json(
            {
                status: 'success',
                data,
                meta: {}
            })

})

const getStats = asyncHandler(async (req, res) => {

    const totalNoUsers = await User.countDocuments();
    const totalReports = await AnalysedStatement.countDocuments();
    const totalNoOfAccountants = await AccountOfficer.countDocuments();
    const newRequest = 3;
    const totoalNoOfAccountingFirm = 10;
    const totalNoOfCompletedRequest = await AnalysedStatement.find({ status: "completed" }).countDocuments()
    const totalNoOfOngoingRequest = await AnalysedStatement.find({ status: 'processing' }).countDocuments()
    const totalNoOfPendingRequest = await AnalysedStatement.find({ status: "pending" }).countDocuments()

    res
        .status(200)
        .json(
            {
                status: 'success',
                data: {
                    totalNoUsers,
                    totalReports,
                    totalNoOfAccountants,
                    newRequest,
                    totoalNoOfAccountingFirm,
                    totalNoOfCompletedRequest,
                    totalNoOfOngoingRequest,
                    totalNoOfPendingRequest
                },
                meta: {}
            })

})

export {
    createNewBDAccount,
    login,
    changePassword,
    getUserDetails,
    getStats
}