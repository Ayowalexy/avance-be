import User from "../models/usermodel.js";
import AnalysedStatement from "../models/analysedStatement.js";
import asyncHandler from "express-async-handler";
import FormData from "form-data";
import dotenv from 'dotenv';
import axios from 'axios';
import periculumToken from "../utilities/periculum-access-token.js";
import StatementStatus from "../models/statement-status.js";
import { allBanksArray } from "../utilities/all-banks.js";
import { uploadBankStatement } from "../utils/generate-pdf-statement.js";
import { statementFileGenerator } from "../pdf.js";
import { generateStatementHtml } from "../utilities/generate-statement-html.js";
import handler from "../utilities/pdf-handler.js";
import BusinessDevelopers from "../models/business-developers.js";

dotenv.config()

const STATEMENT_URL = process.env.STATEMENT
const Client_ID = process.env.Client_ID
const MY_BANK_STATEMENT = process.env.MY_BANK_STATEMENT
const PERICULUM_BASE_URL = process.env.PERICULUM_AUDIENCE
const PAYSTACK_SK = process.env.PAYSTACK_SK


const manualStatementAnalysis = asyncHandler(async (req, res) => {
    if (Boolean(req.body.bankName) && Boolean(req.body.accountNo)) {

        const bankName = req.body.bankName;
        const accountNo = req.body.accountNo;

        const user = await User.findById(req.user.id);

        const form = new FormData()

        form.append("password", req.body.password || '');
        form.append("file", req.file.buffer, req.file.originalname);
        form.append("statementType", "consumer");

        const matchingBank = allBanksArray.find(ele => ele.name.toLowerCase()?.includes(bankName.toLowerCase().trim()));

        // const account = {
        //     name: matchingBank?.name || bankName,
        //     accountNo: accountNo,
        //     bankImg: matchingBank?.logo || '',
        //     createdAt: new Date()
        // }
        const account = {
            name: "Access Bank",
            accountNo: accountNo,
            bankImg: "https://nigerianbanks.xyz/logo/access-bank.png",
            createdAt: new Date()
        }

        // const access_token = await periculumToken();

        try {
            // const periculum = await axios.put(`${PERICULUM_BASE_URL}/statements`, form, {
            //     headers: {
            //         "Authorization": `Bearer ${access_token}`,
            //         ...form.getHeaders(),
            //     }
            // })

            // const key = periculum?.data?.key;

            // console.log(periculum.data)

            //initialized statement status with default manual message
            const statementStatus = new StatementStatus({
                message: 'Your have successfully uploaded you bank statement manually',
                status: 'pending'
            })

            await statementStatus.save();

            let obj = {
                status: 'pending',
                reportOwnerId: req.user.id,
                statementRecoveryType: 'manual',
                // key,
                account,
                user: req.user,
                bankStatementPassword: req.body?.password || "",
                bankStatementLink: req.file.path
            }

            console.log('obj', obj, req.file)

            if (req.body.businessDeveloper) {
                const businessDeveloper = await BusinessDevelopers.findById(req.body.businessDeveloper)
                obj.businessDeveloper = businessDeveloper;
                businessDeveloper.total_uploads = businessDeveloper.total_uploads + 1;
                businessDeveloper.ongoing_request = businessDeveloper.ongoing_request + 1
                await businessDeveloper.save();

            }

            const analysedStatement = new AnalysedStatement(obj)

            analysedStatement.statementStatus.push(statementStatus);

            await analysedStatement.save();
            // await uploadBankStatement(req.file.buffer, key);

            if (user) {
                user.analyzedReports = Number(user.analyzedReports) + 1;
                user.analyzedStatements.push(analysedStatement);
                await user.save();
            }

            return res
                .status(200)
                .json(
                    {
                        status: 'success',
                        // key: periculum?.data?.key,
                        message: "We have sent your retrieved statements to our partners, we'll send you a feedback shortly",
                        meta: {}
                    })

        } catch (e) {
            console.log(e)
            const error = e?.response?.data?.message || "provider not available"
            res.status(400).json({ "status": "error", "message": "invalid error", "meta": { "error": error } })
        }
    } else {
        res.status(401).json({ "status": "error", "message": "invalid error", "meta": { "error": 'Account number and bank name is required' } })

    }
})


const getManualStatementStatus = asyncHandler(async (req, res) => {
    const statementKey = req.query.key;
    const type = req.query.type;
    const access_token = await periculumToken();
    try {
        const statement = await AnalysedStatement.findOne({ key: Number(statementKey) });

        if (!statement.analysed) {
            const response = await axios(`${PERICULUM_BASE_URL}/statements/${statementKey}`, {
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                    "Content-Type": "application/json"
                },
                method: 'get'
            })

            const data = response.data;

            if (data.processingStatus === 'PROCESSED') {
                const key = req.query.key;
                const val = data[type];

                statement.status = 'processed';
                statement.spendAnalysis = data?.spendAnalysis;
                statement.behavioralAnalysis = data?.behavioralAnalysis;
                statement.transactionPatternAnalysis = data?.transactionPatternAnalysis;
                statement.cashFlowAnalysis = data?.cashFlowAnalysis;
                statement.analysed = true;
                statement.details = {
                    uniqueCode: data.uniqueCode,
                    name: data.name,
                    source: data.source,
                    clientFullName: data.clientFullName,
                    clientPhoneNumber: data.clientPhoneNumber,
                    accountType: data.accountType,
                    accountBalance: data.accountBalance,
                    accountId: data.accountId,
                    accountName: data.accountName,
                    bankName: data.bankName,
                    statementType: data.statementType,
                    uploadedBy: data.uploadedBy,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    createdDate: data.createdDate,
                    confidenceOnParsing: data.confidenceOnParsing,
                    pdfCreatedDate: data.pdfCreatedDate,
                    pdfModifiedDate: data.pdfModifiedDate
                }

                //checks if statement file has been generated, if not, generate.
                if (!Boolean(statement.reportLink)) {
                    const statementHtml = await generateStatementHtml(data);
                    await handler(statementHtml, key, Math.floor(Math.random() * 100000000000).toString());
                    // await statementFileGenerator(statementHtml, key);
                    const statementStatus = new StatementStatus({
                        message: 'Your statement has been analysed',
                        status: 'document available'
                    })
                    await statementStatus.save();
                    statement.statementStatus.push(statementStatus);
                }
                await statement.save();

                const creditTurnOver = data?.cashFlowAnalysis?.totalCreditTurnover

                let amountPayable = 0;
                if (creditTurnOver < 5000000000) {
                    amountPayable = Number(creditTurnOver) * 0.05
                } else if (creditTurnOver > 5000000000 && creditTurnOver < 25000000000) {
                    amountPayable = Number(creditTurnOver) * 0.025;
                } else if (creditTurnOver > 25000000000) {
                    amountPayable = Number(creditTurnOver) * 0.15;
                }
                const rate = creditTurnOver < 5000000000 ? '0.05%' : creditTurnOver > 5000000000 && creditTurnOver < 25000000000 ? '0.025%' : creditTurnOver > 25000000000 ? '0.15%' : ''

                return res
                    .status(200)
                    .json(
                        {
                            status: 'success',
                            message: "Statement has been proceed and report now available",
                            type,
                            data: val,
                            amountPayable: Number(amountPayable) + 25000,
                            rate,
                            creditTurnOver,
                            meta: {}
                        })


            } else {
                return res
                    .status(401)
                    .json(
                        {
                            status: 'error',
                            message: "Report for this statement is still being processed",
                            meta: {}
                        })


            }
        } else {
            const val = statement[type];
            const creditTurnOver = statement?.cashFlowAnalysis?.totalCreditTurnover

            let amountPayable = 0;
            if (creditTurnOver < 5000000000) {
                amountPayable = Number(creditTurnOver) * 0.05
            } else if (creditTurnOver > 5000000000 && creditTurnOver < 25000000000) {
                amountPayable = Number(creditTurnOver) * 0.025;
            } else if (creditTurnOver > 25000000000) {
                amountPayable = Number(creditTurnOver) * 0.15;
            }
            const rate = creditTurnOver < 5000000000 ? '0.05%' : creditTurnOver > 5000000000 && creditTurnOver < 25000000000 ? '0.025%' : creditTurnOver > 25000000000 ? '0.15%' : ''

            return res
                .status(200)
                .json(
                    {
                        status: 'success',
                        message: "Statement has been proceed and report now available",
                        type,
                        data: val,
                        type,
                        data: val,
                        amountPayable: Number(amountPayable) + 25000,
                        rate,
                        creditTurnOver,
                        meta: {}
                    })
        }
    } catch (e) {
        console.log(e)
        res
            .status(401)
            .json(
                {
                    status: 'error',
                    message: "Error occured",
                    meta: {}
                })
    }

})

const getAllAnalysedStatements = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id).populate({
        path: 'analyzedStatements',
        populate: {
            path: 'statementStatus',
        }
    })

    const data = user?.analyzedStatements;

    return res
        .status(200)
        .json(
            {
                status: 'success',
                message: "All analysed statement",
                data,
                meta: {}
            })
})


const getOneStatement = asyncHandler(async(req, res) => {
    const statement = await AnalysedStatement.findById({_id: req.params.id}).populate('statementStatus')
    if(statement){
        return res
        .status(200)
        .json(
            {
                status: 'success',
                message: "All analysed statement",
                data: statement,
                meta: {}
            })
    } else {
        res
            .status(401)
            .json(
                {
                    status: 'error',
                    message: `Statement with id ${req.params.id} not found`,
                    meta: {}
                })
    }
})



export {
    manualStatementAnalysis,
    getAllAnalysedStatements,
    getManualStatementStatus,
    getOneStatement
}