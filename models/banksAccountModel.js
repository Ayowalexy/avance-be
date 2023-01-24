import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    bankName: String,
    accountNumber: String,
    bankLogo: String,
    status: String
}, { timestamps: true })

const Account = mongoose.model('account', AccountSchema);

export default Account