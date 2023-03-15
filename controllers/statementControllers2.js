import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import User from '../models/usermodel.js'
import Account from "../models/banksAccountModel.js";
import { loand_d, statement } from "../utils/schema.js";
import AnalysedStatement from "../models/analysedStatement.js";


dotenv.config()


const deletebankAccount = asyncHandler(async (req, res) => {

    const { id } = req.params

    await User.findByIdAndUpdate(req.user.id, { $pull: { bankAccounts: id } })
    await Account.findByIdAndDelete(id)

    res
        .status(201)
        .json(
            {
                status: "success",
                message: 'Account deleted successfully',
                meta: {}
            })

})

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find();

    res
        .status(201)
        .json(
            {
                status: "success",
                message: 'Account deleted successfully',
                data: users,
                meta: {}
            })
})


const getAllDepositTypes = asyncHandler(async (req, res) => {
    const depositTypes = [
        'Savings bank account',
        'Current deposit account',
        'Fixed Deposit account',
        'Recurring deposit account'
    ]
    res
        .status(201)
        .json(
            {
                status: "success",
                message: 'All deposit types',
                data: depositTypes,
                meta: {}
            })
})


const getAllLoanTypes = asyncHandler(async (req, res) => {
    const loanTypes = [
        'Credit card loan',
        'Personal loan',
        'Student loan',
        'Mortgage',
        'Auto loan',
        'Payday loan',
        'Small business loan',
        'Credit builder loan',
        'Debt Consolidation loan',
        'Holiday loan',
        'Medical loan',
        'Vacation loan',
        'Wedding loan',
        'Pool loan',
        'Family loan'
    ]
    res
        .status(201)
        .json(
            {
                status: "success",
                message: 'All loan types',
                data: loanTypes,
                meta: {}
            })
})

const addDocumentToLoan = asyncHandler(async (req, res) => {
    const { error, value } = loand_d.validate(req.body);

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

    const statement = await AnalysedStatement.findOne({ key: value.key });
    const loans = value.loans;

    for (let loan of loans) {
        statement.documents.push(loan);
    }
    await statement.save()

    res
        .status(201)
        .json(
            {
                status: "success",
                message: 'Document added succefully',
                meta: {}
            })
})

const addBankStatementFile = asyncHandler(async (req, res) => {
    const { error, value } = statement.validate(req.body);

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

    const userStatement = await AnalysedStatement.findOne({ key: value.key });
    if (userStatement) {
        const data = {
            documents: [value.file],
            type: "Bank statement"
        }
        userStatement.documents.push(data);
        await userStatement.save()
    }
    res
        .status(201)
        .json(
            {
                status: "success",
                message: 'Document added succefully',
                meta: {}
            })
})

const getAllAnalysedStatements = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate('bankAccounts')
        .populate('analyzedStatements')
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

    console.log(user.analyzedStatements)
    res
        .status(201)
        .json(
            {
                status: "success",
                message: 'Analysed statement',
                data: statements,
                meta: {}
            })
})


export {
    deletebankAccount,
    getAllUsers,
    getAllDepositTypes,
    getAllLoanTypes,
    addDocumentToLoan,
    addBankStatementFile,
    getAllAnalysedStatements
}