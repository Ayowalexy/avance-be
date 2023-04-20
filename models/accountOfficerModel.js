import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;


const accountOfficerSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
        index: true
    },
    password: String,
    otpToken: String,
    canResetPassword: {
        type: Boolean,
        default: false
    },
    analyseStatus: {
        type: String,
        default: 'processing',
        enum: ['analysing', 'idle', 'processing']
    },
    analysedReports: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    status: {
        type: String, 
        default: "active", 
        enum: ['active', 'deactivated', 'suspended'] 
    },
    role: {
        type: String,
        default: "account officer"
    },
    queueNumber: {
        type: Number,
        default: 0
    }, pendingReportCount: {
        type: Number,
        default: 0
    }, pendingReports: [{
        type: Number
    }]
})


accountOfficerSchema.plugin(mongooseUniqueValidator, {
    message: 'Error, {VALUE} already exists.'
});


const AccountOfficer = mongoose.model('accountOfficer', accountOfficerSchema);

export default AccountOfficer