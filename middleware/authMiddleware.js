import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/usermodel.js';
import Admin from '../models/adminModel.js';
import AnalysedStatement from '../models/analysedStatement.js';

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
        throw new Error('User does not exists')

        res.status(401)
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

const isManual = asyncHandler(async(req, res, next) => {
  const statement = await AnalysedStatement.findOne({key: Number(req.query?.key)});
  if(statement.statementRecoveryType === 'manual'){
    next()
  } else {
    res.status(401)
    throw new Error(`Statement with ${req.query?.key} was analysed manually and cannot access this route`)
  }
})


const isAutomatic = asyncHandler(async(req, res, next) => {
  const requestId = req.query.requestId;
  const statement = await AnalysedStatement.findOne({reportId: Number(requestId)});
  if(statement && statement.statementRecoveryType === 'automatic'){
    next()
  } else {
    res.status(401)
    throw new Error(`Statement with ${requestId} was analysed automatically and cannot access this route`)
  }
})


export {
  protect,
  hasRequestId,
  hasTicketId,
  hasStatemetKey,
  bankExist,
  isManual,
  isAutomatic
}