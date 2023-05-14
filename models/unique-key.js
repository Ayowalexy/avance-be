import mongoose from "mongoose";


const uniqueSchema = new mongoose.Schema({
    uniqueKey: {
        type: Number,
        default: 0
    }
})

const UniqueKey = new mongoose.model('uniqueKey', uniqueSchema);

export default UniqueKey;