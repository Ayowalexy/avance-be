import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/usermodel.js';

const { verify } = jwt;


const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = verify(token, process.env.SECRET)

      const user = await User.findById(decoded.id)
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

const hasTicketId = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user.ticketId) {
    next()
    return
  } else {
    res.status(401)
    throw new Error('No ticket id, request for bank statement')
  }
})

const hasRequestId = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user.requestId) {
    next()
    return
  } else {
    res.status(401)
    throw new Error('No request id, request for bank statement')
  }
})


export {
  protect,
  hasRequestId,
  hasTicketId
}