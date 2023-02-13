import dotenv from "dotenv";
import jwt from 'jsonwebtoken';

import AccountOfficer from "../models/accountOfficerModel.js";
import sendAccountOfficerEmail from "./sendEmail.js";

dotenv.config();

const getFreeAccountOfficer = async () => {

    const account_officers = await AccountOfficer.find(
        { status: 'active', analyseStatus: 'idle' },
    ).sort({ queueNumber: -1 })

    const free_officer = account_officers.pop();
    return free_officer
}



export const sendAccountOfficerEmailOfNewSignmentInsight = async (key) => {
    try {
        const freeOfficer = await getFreeAccountOfficer();

        if (freeOfficer) {
            let user = await AccountOfficer.findById({ _id: freeOfficer._id.toString() })
        
            await AccountOfficer.findOneAndUpdate({ _id: freeOfficer._id.toString() }, {
                $set: {
                    pendingReportCount:  user.pendingReportCount + 1,
                    analyseStatus: 'analysing'
                },
                $push: { pendingReports: key }
            })
           
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





