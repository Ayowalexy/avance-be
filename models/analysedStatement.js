import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;


const analysedStatement = new Schema({
    report: {
        type: Object,
        default: {}
    },
    analysedBy: {
        type: Schema.Types.ObjectId,
        ref: "accountOfficer"
    },
    key: {
        type: Number,
        // unique: true,
        // index: true
    },
    reportId: Number,
    uniqueKey: Number,
    spendAnalysis: Object,
    transactionPatternAnalysis: Object,
    behavioralAnalysis: Object,
    cashFlowAnalysis: Object,
    analysed: {
        type: Boolean,
        default: false
    },
    statementRecoveryType: {
        type: String,
        default: '',
        enum: ['manual', 'automatic', '']
    },
    isPaid: {
        type: Boolean,
        default: false,

    },
    reportOwnerId: {
        type: String,
        default: ''
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    accepted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['idle', 'processing', 'declined', 'completed', 'analyzing', 'available', 'pending', 'processed'],
        default: 'processing'
    },
    documents: [{
        type: Object
    }],
    statementStatus: [
        {
            type: Schema.Types.ObjectId,
            ref: 'statementStatus'
        }
    ],
    account: {
        name: String,
        bankImg: String,
        accountNo: String,
        createdAt: String
    },
    amountThatCanBeRecouped: Number,
    reportLink: String,
    bankStatementLink: String,
    bankStatementPassword: String,
    automatickTicketId: String,
    engagementLetterLink: String,
    recoveryReequest: {
        type: Boolean,
        default: false
    },
    dateCustomerRequestedForRecovery: String,
    dateAccountOfficerStartedRecovery: String,
    dateAccountOfficerCompletedRecovery: String,
}, { timestamps: true })


analysedStatement.plugin(mongooseUniqueValidator, {
    message: 'Error, {VALUE} already exists.'
});


const AnalysedStatement = mongoose.model('anaylsedStatement', analysedStatement);

export default AnalysedStatement;