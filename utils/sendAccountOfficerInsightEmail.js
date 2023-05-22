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
        if (acc_officer) {
            free_officer = acc_officer
        } else {
            throw new Error(`Account officer with id ${accountOfficerId} does not exit`)
        }
    } else {
        const account_officers = await AccountOfficer.find(
            { status: 'active', },
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
            account_officer_statements.analysedBy = freeOfficer;
            await account_officer_statements.save();

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





