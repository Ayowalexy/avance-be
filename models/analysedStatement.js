import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;


const analysedStatement = new Schema({
    report: Object,
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
    reportOwnerId: String,
    accepted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['idle', 'processing', 'declined', 'completed'],
        default: 'idle'
    },
    amountThatCanBeRecouped: Number,
    reportLink: String
}, { timeseries: true })


analysedStatement.plugin(mongooseUniqueValidator, {
    message: 'Error, {VALUE} already exists.'
});


const AnalysedStatement = mongoose.model('anaylsedStatement', analysedStatement);

export default AnalysedStatement;