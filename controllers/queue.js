import amqp from 'amqplib/callback_api.js'
import asyncHandler from "express-async-handler";
import { SQSClient, AddPermissionCommand } from "@aws-sdk/client-sqs";
import dotenv from 'dotenv'

dotenv.config()

const AWS_KEY = process.env.AWS_KEY;
const AWS_SECRET = process.env.AWS_SECRET


const addMessageToQueue = asyncHandler(async (req, res) => {

    const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VSkJOVUk0UkRFek9FVTBORGd4UWpVMVJqTTJPVEJEUXpRMFF6bEJRa1F6UWpnd1JETkVSQSJ9.eyJodHRwczovL2luc2lnaHRzLXBlcmljdWx1bS5jb20vdGVuYW50IjoiYWxhZGRpbiIsImlzcyI6Imh0dHBzOi8vcGVyaWN1bHVtLXRlY2hub2xvZ2llcy1pbmMuYXV0aDAuY29tLyIsInN1YiI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2FwaS5pbnNpZ2h0cy1wZXJpY3VsdW0uY29tIiwiaWF0IjoxNjc0MzQ2Njk3LCJleHAiOjE2NzQ5NTE0OTcsImF6cCI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.TH1_KUdGNXeHhKO0kHSW_QCR56kPs-4MiNfqjri5BeIAm9XuRp9zTBs07FZRRR26P1q_4xJCVd2yjUDu1X2YRD0RiyvDuEjZKfQ2L51ruOL-gfklEqsFazn6xVtx8y4uWm0kBotbcXhNa7h3YgHIGkShw3SrMwYBFmQnupberkEhVlxb1oCCtPS4U8SbWZzyz62b4ik797dZN2qmWlBI4pMwF-N8x705KCzbyMv2V4XqavY7xkhBd6g_yAYCnT-Me1jwsjqPInRldcdnr1oqfK9I440E9rVOIZMvndysW60HabUcihjE4DPT8uJvQ9QufWBY55-kZAJgOZHmG0ouyA'

    const configuration = JSON.stringify({
        'credentials': {
            'key': AWS_KEY,
            'secret': AWS_SECRET,
        },

    })

    SQSClient.config(configuration)
    const client = new SQSClient({
        'region': 'us-east-1',
        'version': 'latest',
        
    });


    const params = {
        "mbsParameters": {
            "apiParameters": {
                "clientId": "460",
                "clientSecret": "KtZ#!kVi2HB4D97"
            },
            "customerParameters": {
                "accountNo": '0739676183',
                "bankId": '6',
                "destinationId": 460,
                "role": "Applicant",
                "username": "musideen@aladdin.ng",
                "country": "Nigeria",
                "phone": '08145405006',
                "applicants": {
                    "name": 'Biyi',
                    "applicationNo": ""
                }
            },
            "ticketNo": '1986445-6',
            "password": '3587',
            "startDate": '01-Jan-2023',
            "endDate": '02-Jan-2023',
        },
        "insightsParameters": {
            "accessToken": token
        }
    }

    const command = new AddPermissionCommand(params);

    try {
        const data = await client.send(command);
        // process data.
        console.log('data', data)
    } catch (error) {
        // error handling.
        console.log('error', error)
    } finally {
        // finally.
    }
})


export {
    addMessageToQueue
}