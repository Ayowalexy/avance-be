import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import Admin from '../models/adminModel.js';

const { verify } = jwt;


const adminProtect = asyncHandler(async (req, res, next) => {
    let token

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1]

            const decoded = verify(token, process.env.SECRET)

            const user = await Admin.findById(decoded.id)
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


const isAdmin = asyncHandler(async (req, res, next) => {
    const admin = await Admin.findById(req.user.id);

    if (admin.role === 'admin') {
        next()
    } else {
        res.status(403)
        throw new Error('Not authorised, only admin can access this route')
    }
})



export {
    isAdmin,
    adminProtect
}