import dotenv from "dotenv";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';
import otpGenerator from 'otp-generator'
import User from "../models/usermodel.js";
import AccountOfficer from "../models/accountOfficerModel.js";

const { sign, verify } = jwt;


dotenv.config();


const sendUserInsightAcceptedEmail = async (id) => {

    const user = await User.findById(id);
    if (user) {

        const API_KEY = process.env.SG_API;

        sgMail.setApiKey(API_KEY);


        const name = user.firstName.concat(' ', user.lastName)

        const message = {
            to: user.email,
            from: {
                name: "Avance Insight team",
                email: "goldenimperialswifttech@gmail.com"
            },
            text: "Hello Sample text",
            subject: "Verify OTP",
            html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                    <div style="margin:50px auto;width:70%;padding:20px 0">
                        <div style="border-bottom:1px solid #eee">
                        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Avance</a>
                        </div>
                        <p style="font-size:1.1em">Hi ${name},</p>
                        <p>
                        One of our account officers has accepted to process your statement, provide
                             a summary of how much can be recouped. Once this process is complete, 
                             you'll be notified via email.
                        </p>
                        
                        <p style="font-size:0.9em;">Regards,<br />Avance</p>
                        <hr style="border:none;border-top:1px solid #eee" />
                        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                        <p>Avance Inc</p>
                        <p>Lagos, Nigeria</p>
                        </div>
                    </div>
                    </div>`
        }

        try {
            const response = await sgMail.send(message)
            return response.data
        } catch (e) {
            console.log(e)
        }
    }

}

export default sendUserInsightAcceptedEmail;