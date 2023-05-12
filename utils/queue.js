import amqp from 'amqplib/callback_api.js'
import asyncHandler from "express-async-handler";
import User from '../models/usermodel.js';
import { SQSClient, AddPermissionCommand, GetQueueUrlCommand, SendMessageCommand } from "@aws-sdk/client-sqs";
import dotenv from 'dotenv'

dotenv.config()

const AWS_KEY = process.env.AWS_KEY_3;
const AWS_SECRET = process.env.AWS_SECRET_3;
const Client_ID = process.env.Client_ID;
const Client_Secret = process.env.Client_Secret
const queueUrl = process.env.queueUrl

export const getToken = () => {
    return 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VSkJOVUk0UkRFek9FVTBORGd4UWpVMVJqTTJPVEJEUXpRMFF6bEJRa1F6UWpnd1JETkVSQSJ9.eyJodHRwczovL2luc2lnaHRzLXBlcmljdWx1bS5jb20vdGVuYW50IjoiYWxhZGRpbiIsImlzcyI6Imh0dHBzOi8vcGVyaWN1bHVtLXRlY2hub2xvZ2llcy1pbmMuYXV0aDAuY29tLyIsInN1YiI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2FwaS5pbnNpZ2h0cy1wZXJpY3VsdW0uY29tIiwiaWF0IjoxNjgzNzI0MDE4LCJleHAiOjE2ODQzMjg4MTgsImF6cCI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.qUxmdftb8o_lmhwrUfBrexQ470js1FxcHr2_PZrh89MzvPTxPqxarprFvKJYb5nrrn2rnZfOmfJkTgQ_t7Bplt_V4hUnbBUpBJ05SaRGq01e5xvuW_HZHupMSEj_tz78-DV2inxRVb7v-VgdNfHj--n6JCp-AfLO27ZEdEJRwyTX7-0faUsFvrZFsoKh3Sxp60Wk6eshz_e2iTz03fmvwB9nNT4LR5ncAT0KbjmfR2eNMnEEUShIxRAPp3QMw-dfAyxvlesc_OTw_NRJl4WbM2viQMsYiTMAdEsKCl4-Bn6F_268iE_ElkHgWaDXK8EfUXC8DA_H7HAv7FXWPogRww'
}



const addMessageToQueue = async (ticketNo, pwd, id) => {

    const user = await User.findById(id).populate('customer')
    const customer = user.customer;

    const token_ = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VSkJOVUk0UkRFek9FVTBORGd4UWpVMVJqTTJPVEJEUXpRMFF6bEJRa1F6UWpnd1JETkVSQSJ9.eyJodHRwczovL2luc2lnaHRzLXBlcmljdWx1bS5jb20vdGVuYW50IjoiYWxhZGRpbiIsImlzcyI6Imh0dHBzOi8vcGVyaWN1bHVtLXRlY2hub2xvZ2llcy1pbmMuYXV0aDAuY29tLyIsInN1YiI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2FwaS5pbnNpZ2h0cy1wZXJpY3VsdW0uY29tIiwiaWF0IjoxNjc0MzQ2Njk3LCJleHAiOjE2NzQ5NTE0OTcsImF6cCI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.TH1_KUdGNXeHhKO0kHSW_QCR56kPs-4MiNfqjri5BeIAm9XuRp9zTBs07FZRRR26P1q_4xJCVd2yjUDu1X2YRD0RiyvDuEjZKfQ2L51ruOL-gfklEqsFazn6xVtx8y4uWm0kBotbcXhNa7h3YgHIGkShw3SrMwYBFmQnupberkEhVlxb1oCCtPS4U8SbWZzyz62b4ik797dZN2qmWlBI4pMwF-N8x705KCzbyMv2V4XqavY7xkhBd6g_yAYCnT-Me1jwsjqPInRldcdnr1oqfK9I440E9rVOIZMvndysW60HabUcihjE4DPT8uJvQ9QufWBY55-kZAJgOZHmG0ouyA'
    const token = getToken(); //'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VSkJOVUk0UkRFek9FVTBORGd4UWpVMVJqTTJPVEJEUXpRMFF6bEJRa1F6UWpnd1JETkVSQSJ9.eyJodHRwczovL2luc2lnaHRzLXBlcmljdWx1bS5jb20vdGVuYW50IjoiYWxhZGRpbiIsImlzcyI6Imh0dHBzOi8vcGVyaWN1bHVtLXRlY2hub2xvZ2llcy1pbmMuYXV0aDAuY29tLyIsInN1YiI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2FwaS5pbnNpZ2h0cy1wZXJpY3VsdW0uY29tIiwiaWF0IjoxNjc1MzQ3MTIxLCJleHAiOjE2NzU5NTE5MjEsImF6cCI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.LmQPUoJnZG3Pszytjb4XqUODCxtkvksej9_E5X7s10Yme2yBLiR7ARrr6pGpu0G8NhZCinJSKKBSl1Rvr84lqma1nh9CKMAmoXoJgSTbNlBjS5aawn_ErC4GvGY_YHh-Y8L97Lc4gqp7Z7la30Bm0L1sIwSlAaukZHA_aUqPSqr4_SdpLywFYjKAKPqvL4kwwVM_bAxfVHXbsld4j7Z_TCev2b-iOW5xaacuM2sNgqVpEI1jPdp9T_0Np9JqZrXGz33LloQY1G3YprhnHovXXPo2WH6QXBLOS_1HmafqOStGx3-5XR7ViamW5G7KbUUFCxeiLumjmA0oJGwYYyrrBg'

    const client = new SQSClient({
        'region': 'us-east-1',
        'version': 'latest',
        'credentials': {
            'accessKeyId': AWS_KEY,
            'secretAccessKey': AWS_SECRET,
        },
    });

    const mbsParameter = {
        "mbsParameters": {
            "apiParameters": {
                "clientId": Client_ID,
                "clientSecret": Client_Secret
            },
            "customerParameters": {
                "destinationId": Number(Client_ID),
                "accountNo": customer.accountNo,
                "bankId": Number(customer.bankId),
                "role": "Applicant",
                "username": "musideen@aladdin.ng",
                "country": customer.country,
                "phone": customer.phone,
                "applicants": [{
                    "name": user.firstName.concat(' ', user.lastName),
                    "applicationNo": ""
                }]
            },
            "ticketNo": ticketNo,
            "password": pwd,
            "startDate": customer.startDate,
            "endDate": customer.endDate,
            "uniqueKey": 1
        },
        "insightsParameters": {
            "accessToken": token
        },
    }

const params = {
    "MessageBody": '{\"mbsParameters\":{\"apiParameters\":{\"clientId\":\"460\",\"clientSecret\":\"KtZ#!kVi2HB4D97\"},\"customerParameters\":{\"destinationId\":460,\"accountNo\":\"0255680190\",\"bankId\":12,\"role\":\"Applicant\",\"username\":\"musideen@aladdin.ng\",\"country\":\"NG\",\"phone\":\"8145405006\",\"applicants\":[{\"name\":\"James Gordon\",\"applicationNo\":\"\"}]},\"ticketNo\":\"1753873-12\",\"password\":\"3313\",\"startDate\":\"01-Jan-2023\",\"uniqueKey\":\"1\",\"endDate\":\"04-Mar-2023\"},\"insightsParameters\":{\"accessToken\":\"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VSkJOVUk0UkRFek9FVTBORGd4UWpVMVJqTTJPVEJEUXpRMFF6bEJRa1F6UWpnd1JETkVSQSJ9.eyJodHRwczovL2luc2lnaHRzLXBlcmljdWx1bS5jb20vdGVuYW50IjoiYWxhZGRpbiIsImlzcyI6Imh0dHBzOi8vcGVyaWN1bHVtLXRlY2hub2xvZ2llcy1pbmMuYXV0aDAuY29tLyIsInN1YiI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2FwaS5pbnNpZ2h0cy1wZXJpY3VsdW0uY29tIiwiaWF0IjoxNjgzNzI0MDE4LCJleHAiOjE2ODQzMjg4MTgsImF6cCI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.qUxmdftb8o_lmhwrUfBrexQ470js1FxcHr2_PZrh89MzvPTxPqxarprFvKJYb5nrrn2rnZfOmfJkTgQ_t7Bplt_V4hUnbBUpBJ05SaRGq01e5xvuW_HZHupMSEj_tz78-DV2inxRVb7v-VgdNfHj--n6JCp-AfLO27ZEdEJRwyTX7-0faUsFvrZFsoKh3Sxp60Wk6eshz_e2iTz03fmvwB9nNT4LR5ncAT0KbjmfR2eNMnEEUShIxRAPp3QMw-dfAyxvlesc_OTw_NRJl4WbM2viQMsYiTMAdEsKCl4-Bn6F_268iE_ElkHgWaDXK8EfUXC8DA_H7HAv7FXWPogRww\"}}',
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