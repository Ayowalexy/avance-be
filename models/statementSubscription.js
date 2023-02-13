import mongoose from "mongoose";
const Schema = mongoose.Schema;


const subscriptionSchema = new Schema({
    key: {
        type: Number,
        required: true
    },
    reference: String,
    amount: Number
}, { timestamps: true})


const Subscription = mongoose.model('subscription', subscriptionSchema);

export default Subscription