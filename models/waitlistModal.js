import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";


const Schema = mongoose.Schema;


const waitlistSchema = new Schema({
    email: {
        type: String,
        unique: true,
        index: true
    },
    category: String,
    firstName: String,
    lastName: String,
    phoneNumber: String,
    occupation: String,
    website: String,
    companyName: String,
    companyEmail: String,
}, { timestamps: true })



waitlistSchema.plugin(mongooseUniqueValidator, {
    message: 'Error, {VALUE} already exists.'
});

const Waitlist = mongoose.model("waitlist", waitlistSchema);

export default Waitlist;