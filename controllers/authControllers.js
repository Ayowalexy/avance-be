import asyncHandler from "express-async-handler";
import User from "../models/usermodel.js";
import { signupscchema, loginSchema, emailSchema, otpSchema, passwordSchema, waitlistSchemaIndividual, waitlistSchemaOrganization } from "../utils/schema.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import sendAAuthOtp from "../utils/sendAuthEmail.js";
import Waitlist from "../models/waitlistModal.js";


const { sign, verify } = jwt;



const signUp = asyncHandler(async (req, res) => {
    const { error, value } = signupscchema.validate(req.body);

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
    const user = new User({ ...value, password: hash });
    await user.save();
    await sendAAuthOtp(user._id);
    res
        .status(201)
        .json(
            {
                status: "success",
                message: "user created scuccessfully, an otp has been sent to verify your email",
                meta: {}
            })
})


const loginUser = asyncHandler(async (req, res) => {

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

    const user = await User.findOne({ email: value.email })
        .populate('bankAccounts')
        .populate('analyzedStatements')


    if (user) {
        if (await user.isEmailVerified()) {

            const match = await bcrypt.compareSync(value.password, user.password);

            if (match) {
                const token = sign({ email: user.email, id: user._id.toString() }, process.env.SECRET)
                const statements = user?.analyzedStatements?.map(ele => {
                    return {
                        analysedBy: ele.analysedBy,
                        key: ele.key,
                        isPaid: ele.isPaid,
                        accepted: ele.accepted,
                        status: ele.status,
                        amountThatCanBeRecouped: ele.amountThatCanBeRecouped,
                        reportLink: ele.reportLink
                    }
                })

                const userData = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    accountsLinked: user.accountsLinked,
                    analyzedReports: user.analyzedReports,
                    amountRecouped: user.amountRecouped,
                    createdAt: user.createdAt,
                    emailVerified: user.emailVerified,
                    bankAccounts: user.bankAccounts,
                    analyzedStatements: statements,
                    _id: user._id.toString()
                }
                res
                    .status(200)
                    .json(
                        {
                            data: userData,
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
            res
                .status(401)
                .json(
                    {
                        status: "error",
                        message: 'invalid request',
                        meta: {
                            error: 'Email is not verified'
                        }
                    })
        }

    } else {
        res.status(401).json({ "status": "error", "message": "invalid error", "meta": { "error": "user does not exist" } })
    }
})


const getPasswordResetToken = asyncHandler(async (req, res) => {

    const { error, value } = emailSchema.validate(req.body)
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

    const user = await User.findOne({ email: value.email });
    if (user) {
        await sendAAuthOtp(user._id);
        res
            .status(201)
            .json(
                {
                    status: "success",
                    message: "email sent scuccessfully",
                    meta: {}
                })
    } else {
        res
            .status(401)
            .json(
                {
                    status: "error",
                    message: "invalid request",
                    meta: { error: "email does not exist" }
                })
    }
})



const verifyOtp = asyncHandler(async (req, res) => {

    const { error, value } = otpSchema.validate(req.body);
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

    const user = await User.findOne({ email: value.email });

    if (user) {
        const otpToken = user.otpToken;
        try {
            const decoded = verify(otpToken, process.env.SECRET);
            if (value.otp === decoded.capitalizeOtp) {
                user.canResetPassword = true;
                user.otpToken = ''
                await user.save();
                res
                    .status(200)
                    .json(
                        {
                            status: "success",
                            message: "OTP verified scuccessfully",
                            meta: {}
                        })
            } else {
                res.status(401)
                    .json(
                        {
                            status: "error",
                            message: "invalid request",
                            meta: {
                                error: "OTP does match"
                            }
                        })
            }
        } catch (e) {
            return res
                .status(404)
                .json(
                    {
                        status: "error",
                        message: "invalid request",
                        meta: {
                            error: "OTP has expired"
                        }
                    })
        }


    } else {
        res
            .status(401)
            .json(
                {
                    status: "error",
                    message: "invalid request",
                    meta: { error: "email does not exist" }
                })
    }

})


const resetPassword = asyncHandler(async (req, res) => {

    const { error, value } = passwordSchema.validate(req.body)
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

    const user = await User.findOne({ email: value.email });

    if (user) {
        if (user.canResetPassword) {
            const hash = await bcrypt.hashSync(value.password, 12);
            user.password = hash;
            user.canResetPassword = false;
            await user.save();
            res
                .status(200)
                .json(
                    {
                        status: "success",
                        message: "password changed scuccessfully",
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
                            error: "You need to verify your email address first"
                        }
                    })
        }
    } else {
        res
            .status(401)
            .json(
                {
                    status: "error",
                    message: "invalid request",
                    meta: {
                        error: 'User does not exist'
                    }
                })
    }
})


const verifyEmail = asyncHandler(async (req, res) => {

    const { error, value } = otpSchema.validate(req.body);
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

    const user = await User.findOne({ email: value.email });

    if (user) {
        const otpToken = user.otpToken;

        try {
            const decoded = verify(otpToken, process.env.SECRET);
            if (value.otp === decoded.capitalizeOtp) {
                user.emailVerified = true;
                user.otpToken = ''
                await user.save();

                res
                    .status(200)
                    .json(
                        {
                            status: "success",
                            message: "Email verified scuccessfully",
                            meta: {}
                        })
            } else {
                res.status(401)
                    .json(
                        {
                            status: "error",
                            message: "invalid request",
                            meta: {
                                error: "OTP does match"
                            }
                        })
            }
        } catch (e) {
            return res
                .status(404)
                .json(
                    {
                        status: "error",
                        message: "invalid request",
                        meta: {
                            error: "OTP has exprired"
                        }
                    })
        }
    } else {
        res
            .status(401)
            .json(
                {
                    status: "error",
                    message: "invalid request",
                    meta: {
                        error: 'User does not exist'
                    }
                })
    }
})


const joinWaitlist = asyncHandler(async (req, res) => {

    if (req.body.category) {

        const { error, value } = req.body?.category === 'Individual' ? waitlistSchemaIndividual.validate(req.body) : waitlistSchemaOrganization.validate(req.body);
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

        const user = new Waitlist(value);
        await user.save();

        res
            .status(200)
            .json(
                {
                    status: "success",
                    message: "User added successfully",
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
                        error: 'typeOfOrganization must be Individual or Organization'
                    }
                })
    }

})


export {
    signUp,
    loginUser,
    getPasswordResetToken,
    verifyOtp,
    resetPassword,
    verifyEmail,
    joinWaitlist
}