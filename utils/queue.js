import amqp from 'amqplib/callback_api.js'
import asyncHandler from "express-async-handler";
import User from '../models/usermodel.js';
import { SQSClient, AddPermissionCommand, GetQueueUrlCommand, SendMessageCommand } from "@aws-sdk/client-sqs";
import dotenv from 'dotenv'
import periculumToken from '../utilities/periculum-access-token.js';

dotenv.config()

const AWS_KEY = process.env.AWS_KEY_3;
const AWS_SECRET = process.env.AWS_SECRET_3;
const Client_ID = process.env.Client_ID;
const Client_Secret = process.env.Client_Secret
const queueUrl = process.env.queueUrl

export const getToken = () => {
    return 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VSkJOVUk0UkRFek9FVTBORGd4UWpVMVJqTTJPVEJEUXpRMFF6bEJRa1F6UWpnd1JETkVSQSJ9.eyJodHRwczovL2luc2lnaHRzLXBlcmljdWx1bS5jb20vdGVuYW50IjoiYWxhZGRpbiIsImlzcyI6Imh0dHBzOi8vcGVyaWN1bHVtLXRlY2hub2xvZ2llcy1pbmMuYXV0aDAuY29tLyIsInN1YiI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2FwaS5pbnNpZ2h0cy1wZXJpY3VsdW0uY29tIiwiaWF0IjoxNjg2MTMzNzE2LCJleHAiOjE2ODY3Mzg1MTYsImF6cCI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.n3RWvr1Kmrh-UQ0EakNEwFnodAYHfWsF1t2DKW0-pbrt69e3SY9BkGlPSQzOk59plxClhNc_ARVQTy29wl3GmFs-ZlYGDbyKC6nVPrxoIS_4PGUh2TnHi27UQy-hSEcEMJFazCu1E_aHDeL_LREUVzS-ZXcr_P3Aq4LGIEZWpCxbnP68fNSIZAPu0xQKhf1NlE5Q8-qxH3uB7KDZIUO6XELJIdSI0BkzUXvslFK8LT7uFTvnYzQUZnGJGwF3SydVSxygEdatUYiyhEZGVgJ3dmKvViw8XrNb3-Mk2jC8773peGl4KcWZZlw_uBiahBEG5n8qxkaCHnCtJBu-b8zCTQ'
}



const addMessageToQueue = async (data) => {

    console.log('queue data', data)
    const { 
        ticketNo, 
        pwd, 
        id,
        accountNo,
        uniqueKey,
        bankId,
        phone,
        name,
        startDate,
        endDate
     } = data;

    const user = await User.findById(id).populate('customer')
    const customer = user.customer;

    const token = await periculumToken();

    const client = new SQSClient({
        'region': 'us-east-1',
        'version': 'latest',
        'credentials': {
            'accessKeyId': 'AKIATTGIS7NIC6L77N5Y',
            'secretAccessKey': '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',
        },
    });

    const mbsParameter = {
        "uniqueKey": uniqueKey,
        "mbsParameters": {
            "apiParameters": {
                "clientId": Client_ID,
                "clientSecret": Client_Secret
            },
            "customerParameters": {
                "destinationId": Number(Client_ID),
                "accountNo": accountNo,
                "bankId": Number(bankId),
                "role": "Applicant",
                "username": "musideen@aladdin.ng",
                "country": 'NG',
                "phone": phone,
                "applicants": [{
                    "name": name,
                    "applicationNo": ""
                }]
            },
            "ConfirmStatementFlag": true,
            "ticketNo": ticketNo,
            "password": pwd,
            "startDate": startDate,
            "endDate": endDate,
        },
        "insightsParameters": {
            "accessToken": token
        },
    }

    const params = {
        "MessageBody": `{\"uniqueKey\":${uniqueKey},\"mbsParameters\":{\"apiParameters\":{\"clientId\":\"${Client_ID}\",\"clientSecret\":\"${Client_Secret}\"},\"customerParameters\":{\"destinationId\":${Number(Client_ID)},\"accountNo\":\"${accountNo}\",\"bankId\":${Number(bankId)},\"role\":\"Applicant\",\"username\":\"musideen@aladdin.ng\",\"country\":\"NG\",\"phone\":\"${phone}\",\"applicants\":[{\"name\":\"${name}\",\"applicationNo\":\"\"}]},\"ticketNo\":\"${ticketNo}\",\"password\":\"${pwd}\",\"startDate\":\"${startDate}\",\"endDate\":\"${endDate}\"},\"insightsParameters\":{\"accessToken\":\"${token}\"}}`,
        "QueueUrl": queueUrl
      }

      console.log(params)

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