import getPericulumAccessToken from "../utils/periculumAccessToken.js";
import PericulumToken from "../models/token.js";
import cron from 'node-cron'


const periculumToken = async () => {
    //   const token  = await getPericulumAccessToken();
    //   console.log(token)
    const access_token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VSkJOVUk0UkRFek9FVTBORGd4UWpVMVJqTTJPVEJEUXpRMFF6bEJRa1F6UWpnd1JETkVSQSJ9.eyJodHRwczovL2luc2lnaHRzLXBlcmljdWx1bS5jb20vdGVuYW50IjoiYWxhZGRpbiIsImlzcyI6Imh0dHBzOi8vcGVyaWN1bHVtLXRlY2hub2xvZ2llcy1pbmMuYXV0aDAuY29tLyIsInN1YiI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2FwaS5pbnNpZ2h0cy1wZXJpY3VsdW0uY29tIiwiaWF0IjoxNjg4Mzg0NjU3LCJleHAiOjE2ODg5ODk0NTcsImF6cCI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.QLG0zv5z2kZ-XuffAdOAELFdlPjpjrCt796FMWmG2l2V7ygdkUJzWZczQz0-xEduW4buZI8XzZYjDD2FaJeC7XMjQJcdfJaQuVn4pVWu5lMVYyTOznc3338PKIpMk9xyAKsO4cFnWkbLxrXj5kBOP23qxw3tncrMvnL2_gd6yXRUlPgxnCRX6JjZ1zyCD8-EVVcybgleoFAnBlax8yIXyPO1mpw-qkqQCLhciSapwJa34cMxg5JR6bGNyKx99_T0w1ljeozVaVzOctDnO4YxTpB7U9ZuZbAtw8nXmgCADFGsrtZnIZtng8eRntshw_94oLynIpCZoaFIl4Jmwvl7YQ'
    return access_token
}


export default periculumToken