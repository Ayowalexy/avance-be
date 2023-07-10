import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import BusinessDevelopers from '../models/business-developers.js';

const { verify } = jwt;


const bdprotect = asyncHandler(async (req, res, next) => {
    let token

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1]

            const decoded = verify(token, process.env.SECRET)

            const user = await BusinessDevelopers.findById(decoded.id)
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





export {
    bdprotect
}