import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";


const Schema = mongoose.Schema;


const accountantSchema = new Schema({
    email: {
        type: String,
        unique: true,
        index: true
    },
    name: String,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
}, { timestamps: true})

accountantSchema.plugin(mongooseUniqueValidator, {
    message: 'Error, {VALUE} already exists.'
});


const Accountants = mongoose.model('accountants', accountantSchema);

export default Accountants