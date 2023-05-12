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
        unique: true,
        index: true
    },
    isPaid: {
        type: Boolean,
        default: false,

    },
    reportOwnerId: {
        type: String,
        default: ''
    },
    accepted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['idle', 'processing', 'declined', 'completed', 'analyzing', 'available'],
        default: 'processing'
    },
    documents: [{
        type: Object
    }],
    amountThatCanBeRecouped: Number,
    reportLink: String,
    bankStatementLink: String,
    engagementLetterLink: String,
    recoveryReequest: {
        type: Boolean,
        default: false
    },
    dateCustomerRequestedForRecovery: String,
    dateAccountOfficerStartedRecovery: String,
    dateAccountOfficerCompletedRecovery: String,
}, { timeseries: true })


analysedStatement.plugin(mongooseUniqueValidator, {
    message: 'Error, {VALUE} already exists.'
});


const AnalysedStatement = mongoose.model('anaylsedStatement', analysedStatement);

export default AnalysedStatement;