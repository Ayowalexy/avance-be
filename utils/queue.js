import amqp from 'amqplib/callback_api.js'
import asyncHandler from "express-async-handler";
import User from '../models/usermodel.js';
import { SQSClient, AddPermissionCommand, GetQueueUrlCommand, SendMessageCommand } from "@aws-sdk/client-sqs";
import dotenv from 'dotenv'

dotenv.config()

const AWS_KEY = process.env.AWS_KEY;
const AWS_SECRET = process.env.AWS_SECRET
const Client_ID = process.env.Client_ID;
const Client_Secret = process.env.Client_Secret
const queueUrl = process.env.queueUrl



const addMessageToQueue = async (ticketNo, pwd, id) => {

    const user = await User.findById(id).populate('customer')
    const customer = user.customer;

    const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VSkJOVUk0UkRFek9FVTBORGd4UWpVMVJqTTJPVEJEUXpRMFF6bEJRa1F6UWpnd1JETkVSQSJ9.eyJodHRwczovL2luc2lnaHRzLXBlcmljdWx1bS5jb20vdGVuYW50IjoiYWxhZGRpbiIsImlzcyI6Imh0dHBzOi8vcGVyaWN1bHVtLXRlY2hub2xvZ2llcy1pbmMuYXV0aDAuY29tLyIsInN1YiI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2FwaS5pbnNpZ2h0cy1wZXJpY3VsdW0uY29tIiwiaWF0IjoxNjc0MzQ2Njk3LCJleHAiOjE2NzQ5NTE0OTcsImF6cCI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.TH1_KUdGNXeHhKO0kHSW_QCR56kPs-4MiNfqjri5BeIAm9XuRp9zTBs07FZRRR26P1q_4xJCVd2yjUDu1X2YRD0RiyvDuEjZKfQ2L51ruOL-gfklEqsFazn6xVtx8y4uWm0kBotbcXhNa7h3YgHIGkShw3SrMwYBFmQnupberkEhVlxb1oCCtPS4U8SbWZzyz62b4ik797dZN2qmWlBI4pMwF-N8x705KCzbyMv2V4XqavY7xkhBd6g_yAYCnT-Me1jwsjqPInRldcdnr1oqfK9I440E9rVOIZMvndysW60HabUcihjE4DPT8uJvQ9QufWBY55-kZAJgOZHmG0ouyA'

    const client = new SQSClient({
        'region': 'us-east-1',
        'version': 'latest',
        'credentials': {
            'accessKeyId': AWS_KEY,
            'secretAccessKey': AWS_SECRET,
        },
    });

    const mbsParameter = {
        "apiParameters": {
            "clientId": Client_ID,
            "clientSecret": Client_Secret
        },
        "customerParameters": {
            ...customer?._doc,
            "destinationId": Client_ID,
            "username": "musideen@aladdin.ng",
            "applicants": {
                "name": user.firstName.concat(' ', user.lastName),
                "applicationNo": ""
            }
        },
        "ticketNo": ticketNo,
        "password": pwd,
        "startDate": customer.startDate,
        "endDate": customer.endDate,
        "insightsParameters": {
            "accessToken": token
        },
    }

    const params = {
        "MessageBody": JSON.stringify(mbsParameter),
        "QueueUrl": queueUrl
    }

    try {
        const data = await client.send(new SendMessageCommand(params));
        console.log("Success, message sent. MessageID:", data.MessageId);
        return data;
    } catch (err) {
        console.log("Error", err);
    }

}


export {
    addMessageToQueue
}