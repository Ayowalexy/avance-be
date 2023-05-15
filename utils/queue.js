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
    return 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VSkJOVUk0UkRFek9FVTBORGd4UWpVMVJqTTJPVEJEUXpRMFF6bEJRa1F6UWpnd1JETkVSQSJ9.eyJodHRwczovL2luc2lnaHRzLXBlcmljdWx1bS5jb20vdGVuYW50IjoiYWxhZGRpbiIsImlzcyI6Imh0dHBzOi8vcGVyaWN1bHVtLXRlY2hub2xvZ2llcy1pbmMuYXV0aDAuY29tLyIsInN1YiI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2FwaS5pbnNpZ2h0cy1wZXJpY3VsdW0uY29tIiwiaWF0IjoxNjgzNzI0MDE4LCJleHAiOjE2ODQzMjg4MTgsImF6cCI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.qUxmdftb8o_lmhwrUfBrexQ470js1FxcHr2_PZrh89MzvPTxPqxarprFvKJYb5nrrn2rnZfOmfJkTgQ_t7Bplt_V4hUnbBUpBJ05SaRGq01e5xvuW_HZHupMSEj_tz78-DV2inxRVb7v-VgdNfHj--n6JCp-AfLO27ZEdEJRwyTX7-0faUsFvrZFsoKh3Sxp60Wk6eshz_e2iTz03fmvwB9nNT4LR5ncAT0KbjmfR2eNMnEEUShIxRAPp3QMw-dfAyxvlesc_OTw_NRJl4WbM2viQMsYiTMAdEsKCl4-Bn6F_268iE_ElkHgWaDXK8EfUXC8DA_H7HAv7FXWPogRww'
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
            'accessKeyId': AWS_KEY,
            'secretAccessKey': AWS_SECRET,
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