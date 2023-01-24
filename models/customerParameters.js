import mongoose from "mongoose";
const Schema = mongoose.Schema;


const customerParameterSchema = new Schema({
    accountNo: String,
    bankId: String,
    role: String,
    country: {
        type: String,
        default: "Nigeria"
    },
    phone: String,
    startDate: String,
    endDate: String
})

const Customer = mongoose.model('customer', customerParameterSchema);

export default Customer