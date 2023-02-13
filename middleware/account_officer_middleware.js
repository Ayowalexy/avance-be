import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import AccountOfficer from '../models/accountOfficerModel.js';

const { verify } = jwt;


const accountOfficerProtect = asyncHandler(async (req, res, next) => {
    let token

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1]

            const decoded = verify(token, process.env.SECRET)

            const user = await AccountOfficer.findById(decoded.id)
            if (user) {
                req.user = user
                next()
            } else {
                res.status(401)
                throw new Error('User does not exists')
            }
        } catch (error) {
            console.error(error)
            res.status(401)
            throw new Error('Not authorized, token failed')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})


const isAccountOfficer = asyncHandler(async (req, res, next) => {
    const account_officer = await AccountOfficer.findById(req.user.id);

    if (account_officer.role === 'account officer') {
        next()
    } else {
        res.status(403)
        throw new Error('Not authorised, only account officer can access this route')
    }
})


export {
    isAccountOfficer,
    accountOfficerProtect
}