import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/usermodel.js';
import Admin from '../models/adminModel.js';

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

const hasStatemetKey = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user.statementKey) {
    next()
    return
  } else {
    res.status(401)
    throw new Error('No statement key, upload your bank statement')
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


const bankExist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('bankAccounts')

  const hasbank = user.bankAccounts.some(ele => ele._id.toString() === req.params.id)
  if (hasbank) {
    next()
    return
  } else {
    res.status(401)
    throw new Error(`Bank with the given id, ${req.params.id} does not exit`)
  }
})




export {
  protect,
  hasRequestId,
  hasTicketId,
  hasStatemetKey,
  bankExist
}