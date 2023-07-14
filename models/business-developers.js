import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;

const businessDevelopersSchema = new Schema({
    email: {
        type: String,
        unique: true,
        index: true
    },
    password: String,
    phoneNumber: String,
    fullName: String,
    role: {
        type: String,
        default: 'developer',
        enum: ['developer', 'admin']
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'suspended']
    },
    isUpdated: {
        type: Boolean,
        default: false
    }
})

businessDevelopersSchema.plugin(mongooseUniqueValidator, {
    message: 'Error, {VALUE} already exists.'
});

businessDevelopersSchema.methods.checkIsUpdated = async function () {
    return this.isUpdated
}


const BusinessDevelopers = mongoose.model('businessDeveloper', businessDevelopersSchema);

export default BusinessDevelopers