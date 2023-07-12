import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";


const Schema = mongoose.Schema;


const accountingFirmSchema = new Schema({
    name: {
        type: String,
        unique: true,
        index: true
    },
    no_of_accountants: {
        type: Number,
        default: 0
    },
    analysed_reports: {
        type: Number,
        default: 0
    },
    ongoing_reports: {
        type: Number,
        default: 0
    },
    amount_recouped: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'suspended'],
        default: 'active'
    },
    accounts: [{
        type: Schema.Types.ObjectId,
        ref: "accountants"
    }],
    reports: [{
        type: Schema.Types.ObjectId,
        ref: "anaylsedStatement"
    }]
}, { timestamps: true })


accountingFirmSchema.plugin(mongooseUniqueValidator, {
    message: 'Error, {VALUE} already exists.'
});

const AccountingFirm = mongoose.model('accounting firm', accountingFirmSchema);

export default AccountingFirm