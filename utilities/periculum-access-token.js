import getPericulumAccessToken from "../utils/periculumAccessToken.js";
import PericulumToken from "../models/token.js";
import cron from 'node-cron'


const periculumToken = async () => {
    //   const token  = await getPericulumAccessToken();
    //   console.log(token)
    const access_token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VSkJOVUk0UkRFek9FVTBORGd4UWpVMVJqTTJPVEJEUXpRMFF6bEJRa1F6UWpnd1JETkVSQSJ9.eyJodHRwczovL2luc2lnaHRzLXBlcmljdWx1bS5jb20vdGVuYW50IjoiYWxhZGRpbiIsImlzcyI6Imh0dHBzOi8vcGVyaWN1bHVtLXRlY2hub2xvZ2llcy1pbmMuYXV0aDAuY29tLyIsInN1YiI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2FwaS5pbnNpZ2h0cy1wZXJpY3VsdW0uY29tIiwiaWF0IjoxNjg2MTMzNzE2LCJleHAiOjE2ODY3Mzg1MTYsImF6cCI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.n3RWvr1Kmrh-UQ0EakNEwFnodAYHfWsF1t2DKW0-pbrt69e3SY9BkGlPSQzOk59plxClhNc_ARVQTy29wl3GmFs-ZlYGDbyKC6nVPrxoIS_4PGUh2TnHi27UQy-hSEcEMJFazCu1E_aHDeL_LREUVzS-ZXcr_P3Aq4LGIEZWpCxbnP68fNSIZAPu0xQKhf1NlE5Q8-qxH3uB7KDZIUO6XELJIdSI0BkzUXvslFK8LT7uFTvnYzQUZnGJGwF3SydVSxygEdatUYiyhEZGVgJ3dmKvViw8XrNb3-Mk2jC8773peGl4KcWZZlw_uBiahBEG5n8qxkaCHnCtJBu-b8zCTQ'
    return access_token
}


export default periculumToken