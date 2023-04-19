import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
import InvoiceGenerator from "./generateTable.js";
import AccountOfficer from "../models/accountOfficerModel.js";
import sendAccountOfficerEmail from "./sendEmail.js";
import AnalysedStatement from "../models/analysedStatement.js";
import uploadToCloudinary from "./upload-pdf.js";
import path from "path"

dotenv.config();

const getFreeAccountOfficer = async (accountOfficerId) => {

    let free_officer;

    if (accountOfficerId) {
        let acc_officer = await AccountOfficer.findById(accountOfficerId.toString())
        if(acc_officer){
            free_officer = acc_officer
        } else {
            throw new Error(`Account officer with id ${accountOfficerId} does not exit`)
        }
    } else {
        const account_officers = await AccountOfficer.find(
            { status: 'active', analyseStatus: 'idle' },
        ).sort({ queueNumber: -1 })
        free_officer = account_officers.pop();
    }

    return free_officer
}



export const sendAccountOfficerEmailOfNewSignmentInsight = async (key, accountOfficerId) => {
    try {
        let freeOfficer;

        if (accountOfficerId) {
            freeOfficer = await getFreeAccountOfficer(accountOfficerId);
        } else {
            freeOfficer = await getFreeAccountOfficer();
        }

        console.log('free officer', freeOfficer)

        if (freeOfficer) {
            let user = await AccountOfficer.findById({ _id: freeOfficer._id.toString() })

            await AccountOfficer.findOneAndUpdate({ _id: freeOfficer._id.toString() }, {
                $set: {
                    pendingReportCount: user.pendingReportCount + 1,
                    analyseStatus: 'analysing'
                },
                $push: { pendingReports: key }
            })
            const account_officer_statements = await AnalysedStatement.findOne({ key: { $in: [key] } })
            console.log(freeOfficer.email, account_officer_statements)

            const data = {
                spendAnalysis: account_officer_statements?.report?.spendAnalysis,
                transactionPatternAnalysis: account_officer_statements?.report?.transactionPatternAnalysis,
                behavioralAnalysis: account_officer_statements?.report?.behavioralAnalysis,
                cashFlowAnalysis: account_officer_statements?.report?.cashFlowAnalysis,
                incomeAnalysis: account_officer_statements?.report?.incomeAnalysis,
                name: 'Biyi'
            }

            // const reportPdf = new InvoiceGenerator(data);
            // reportPdf.generate()
            // console.log(data)
            // console.log(path.resolve('Biyi.pdf'))
            // const url = await uploadToCloudinary(path.resolve('Biyi.pdf'))
            // console.log(url)
            await sendAccountOfficerEmail(freeOfficer._id.toString());

            return 'success'

        } else {
            return 'no account officer is free'
        }

    } catch (e) {
        console.log(e)
        return 'error'
    }
}





