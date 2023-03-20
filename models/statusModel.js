import mongoose from "mongoose";
const Schema = mongoose.Schema;


const statusSchema = new Schema({
    sender: String,
    message: String,
    status: String,
    key: Number
}, { timestamps: true })

const Status = mongoose.model('status', statusSchema);

export default Status
