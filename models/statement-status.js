import mongoose from "mongoose";
const Schema = mongoose.Schema;


const statementStatusSchema = new Schema({
    message: String,
    key: Number,
    status: {
        type: String,
        default: '',
        enum: ['pending', 'declined', 'uploaded', 'completed', 'successful', 'document available', 'processed']
    }
}, { timestamps: true })

const StatementStatus = mongoose.model('statementStatus', statementStatusSchema);

export default StatementStatus;
