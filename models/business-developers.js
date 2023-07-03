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
    fullName: String
})

businessDevelopersSchema.plugin(mongooseUniqueValidator, {
    message: 'Error, {VALUE} already exists.'
});


const BusinessDevelopers = mongoose.model('businessDeveloper', businessDevelopersSchema);

export default BusinessDevelopers