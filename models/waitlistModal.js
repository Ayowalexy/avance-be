import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";


const Schema = mongoose.Schema;


const waitlistSchema = new Schema({
    email: {
        type: String,
        unique: true,
        index: true
    },
}, { timestamps: true })



waitlistSchema.plugin(mongooseUniqueValidator, {
    message: 'Error, {VALUE} already exists.'
});

const Waitlist = mongoose.model("waitlist", waitlistSchema);

export default Waitlist;