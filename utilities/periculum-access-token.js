import getPericulumAccessToken from "../utils/periculumAccessToken.js";
import PericulumToken from "../models/token.js";
import cron from 'node-cron'


const periculumToken = async () => {
    //   const token  = await getPericulumAccessToken();
    //   console.log(token)
    const access_token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1VSkJOVUk0UkRFek9FVTBORGd4UWpVMVJqTTJPVEJEUXpRMFF6bEJRa1F6UWpnd1JETkVSQSJ9.eyJodHRwczovL2luc2lnaHRzLXBlcmljdWx1bS5jb20vdGVuYW50IjoiYWxhZGRpbiIsImlzcyI6Imh0dHBzOi8vcGVyaWN1bHVtLXRlY2hub2xvZ2llcy1pbmMuYXV0aDAuY29tLyIsInN1YiI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2FwaS5pbnNpZ2h0cy1wZXJpY3VsdW0uY29tIiwiaWF0IjoxNjkyMzU5NzgyLCJleHAiOjE2OTI5NjQ1ODIsImF6cCI6IjUwaW0yTHl4ZGhTaTBwTDhuOW1ycmRKaUEyZlJKV2tnIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.bQ4SOtmywFSXmiLkveoHBtkSZxZh4RcUABF5mRrAjTiPwqRNNvmzLmF5c_tDHceCo79reX8HtYMCH1MjYHIA68jIdQUT94-bgnUpzBEV2LFszimj30Gfrdui2jv1eC_nPVW7h5UsHJgUFNY9784Mf96D8wWWTODQpXWvCTJB8-B0-kphlbtKfb1FokyydN-eBZdb6f45W-Js0uVW859CzNdvp6CoVqOTuYOWStVG4Wsia48-Jd-gA40AtAPov9GC2RNyEJZBDsnw6VKYi4tccTmF9hmbRptECK_El1XIpC13B7F9oDHq3Szkf8r94_Gya_bWVHzJDXic_Hx6dCMsWQ'
    return access_token
}


export default periculumToken