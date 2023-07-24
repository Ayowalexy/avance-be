import asyncHandler from "express-async-handler";
import { adminSchema, adminLoginSchema } from "../utils/schema.js";
import bcrypt from 'bcryptjs'
import Admin from "../models/adminModel.js";
import AccountOfficer from "../models/accountOfficerModel.js";
import jwt from 'jsonwebtoken';

const { sign, verify } = jwt;





const AdminSignUp = asyncHandler(async (req, res) => {
    const { error, value } = adminSchema.validate(req.body);

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

    const hash = await bcrypt.hashSync(value.password, 12);
    const admin = new Admin({ ...value, password: hash });
    await admin.save();

    res
        .status(201)
        .json(
            {
                status: "success",
                message: "Admin account created scuccessfully",
                meta: {}
            })


})


const adminLogin = asyncHandler(async (req, res) => {

    const { error, value } = adminLoginSchema.validate(req.body);

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

    const admin = await Admin.findOne({ email: value.email });

    if (admin) {
        const match = await bcrypt.compareSync(value.password, admin.password);

        if (match) {
            const token = sign({ email: admin.email, id: admin._id.toString() }, process.env.SECRET)

            const data = {
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                role: admin.role
            }

            res
                .status(200)
                .json(
                    {
                        data: data,
                        token: token,
                        status: "success",
                        meta: {}
                    })
        } else {
            res
                .status(401)
                .json(
                    {
                        status: "error",
                        message: 'invalid request',
                        meta: {
                            error: 'Email of password is incorrect'
                        }
                    })
        }

    } else {
        res.status(401).json({ "status": "error", "message": "invalid error", "meta": { "error": "user does not exist" } })
    }

})


const createAccountOfficerAccount = asyncHandler(async (req, res) => {
    const { error, value } = adminSchema.validate(req.body);

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

    const hash = await bcrypt.hashSync(value.password, 12);
    const num_of_admin_officer = await AccountOfficer.count();

    const account_officer = new AccountOfficer({ ...value, password: hash, queueNumber: num_of_admin_officer });
    await account_officer.save();

    res
        .status(201)
        .json(
            {
                status: "success",
                message: "Account officer account created scuccessfully",
                meta: {}
            })
})


const accountOfficerLogin = asyncHandler(async (req, res) => {

    const { error, value } = adminLoginSchema.validate(req.body);

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

    const account_officer = await AccountOfficer.findOne({ email: value.email });

    if (account_officer) {
        const match = await bcrypt.compareSync(value.password, account_officer.password);

        if (match) {
            const token = sign({ email: account_officer.email, id: account_officer._id.toString() }, process.env.SECRET)

            const data = {
                firstName: account_officer.firstName,
                lastName: account_officer.lastName,
                email: account_officer.email,
                role: account_officer.role,
                pendingReportCount: account_officer.pendingReportCount,
                pendingReports: account_officer.pendingReports,
                status: account_officer.status,
                analysedReports: account_officer?.analysedReports?.length,
                analyseStatus: account_officer.analyseStatus,
                _id: account_officer._id
            }

            res
                .status(200)
                .json(
                    {
                        data: data,
                        token: token,
                        isAutoGenerated: account_officer.password.length < 5 ? true : false,
                        status: "success",
                        meta: {}
                    })
        } else {
            res
                .status(401)
                .json(
                    {
                        status: "error",
                        message: 'invalid request',
                        meta: {
                            error: 'Email of password is incorrect'
                        }
                    })
        }

    } else {
        res.status(401).json({ "status": "error", "message": "invalid error", "meta": { "error": "user does not exist" } })
    }

})


export {
    AdminSignUp,
    adminLogin,
    createAccountOfficerAccount,
    accountOfficerLogin
}