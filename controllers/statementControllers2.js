import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import User from '../models/usermodel.js'
import Account from "../models/banksAccountModel.js";
import { loand_d, statement, statusSchema } from "../utils/schema.js";
import AnalysedStatement from "../models/analysedStatement.js";
import Status from "../models/statusModel.js";


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
        // 'Savings bank account',
        // 'Current deposit account',
        // 'Fixed Deposit account',
        // 'Recurring deposit account'
        'LPO financing',
        'Development financing',
        'Project financing',
        "Public Private partnerships PPP's",
        'Bonds and Guarantees',
        'Letter of credits',
        'Structured Trade and Commodity financing',
        'Form A, M and Q',
        'Supply chain finance',
        'Form NXP and NCX',
        'Treasury bills',
        'Futures and forwards',
        'FGN bonds',
        'Fixed Deposits'
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
        // 'Credit card loan',
        // 'Personal loan',
        // 'Student loan',
        // 'Mortgage',
        // 'Auto loan',
        // 'Payday loan',
        // 'Small business loan',
        // 'Credit builder loan',
        // 'Debt Consolidation loan',
        // 'Holiday loan',
        // 'Medical loan',
        // 'Vacation loan',
        // 'Wedding loan',
        // 'Pool loan',
        // 'Family loan'
        'Term loans',
        'Line of Credit',
        'Working Capital loans',
        'Venture loans',
        'Real estate loans',
        'Equipment loans',
        'Loan against future lease rentals',
        'Short-term loans',
        'Invoice discounting',
        'LPO financing',
        'Development financing'
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

    // statement.documents = [];
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
        console.log(ele)
        return {
            analysedBy: ele.analysedBy,
            key: ele.key,
            isPaid: ele.isPaid,
            accepted: ele.accepted,
            status: ele.status,
            amountThatCanBeRecouped: ele.amountThatCanBeRecouped,
            reportLink: ele.reportLink,
            bankName: ele.report.bankName ? ele.report.bankName : 'ACCESS BANK',
            accountId: ele.report.accountId ? ele.report.accountId : '073****183',
            createdAt: ele.report.createdDate
        }
    })


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

const deleteUserStatment = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate('bankAccounts')
        .populate('analyzedStatements');

    const index = user.analyzedStatements.findIndex(ele => Number(ele.report.key) === Number(req.params.key));
    const data = user.analyzedStatements.filter(ele => Number(ele.report.key) === Number(req.params.key));

    let copy = data?.splice(index, 1);
    user.analyzedStatements = data;
    await user.save();

    res
        .status(201)
        .json(
            {
                status: "success",
                message: 'Analysed statement',
                data: copy,
                meta: {}
            })

})


const getAllStatus = asyncHandler(async (req, res) => {
    const key = req.params.key;
    if (key) {
        const status = await Status.find({ key });
        if (status.length) {
            res
                .status(201)
                .json(
                    {
                        status: "success",
                        message: 'statement status',
                        data: status,
                        meta: {}
                    })
        } else {
            res
                .status(403)
                .json(
                    {
                        status: "error",
                        meta: { error: `Statement with key ${key} not found` }
                    })
        }
    } else {
        res
            .status(403)
            .json(
                {
                    status: "error",
                    meta: { error: 'Not found' }
                })
    }
})

const addStatusReport = asyncHandler(async (req, res) => {
    const { error, value } = statusSchema.validate(req.body);

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

    const user = await User.findById(req.user._id);

    const status = new Status({
        sender: user.firstName.concat(' ', user.lastName),
        message: value.message,
        status: 'pending',
        key: value.key
    })

    await status.save();
    res
        .status(201)
        .json(
            {
                status: "success",
                message: 'status updated',
                meta: {}
            })
})

const getUserbanks = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate('bankAccounts')


    const data = user.bankAccounts;
    console.log(user.bankAccounts)
    res
        .status(200)
        .json(
            {
                data: data,
                status: "success",
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
    getAllAnalysedStatements,
    getAllStatus,
    addStatusReport,
    getUserbanks,
    deleteUserStatment
}