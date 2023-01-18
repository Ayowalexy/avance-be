import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
        index: true
    },
    password: String,
    otpToken: String,
    canResetPassword: {
        type: Boolean,
        default: false
    },
    accountsLinked: {
        type: Number,
        default: 0
    },
    analyzedReports: {
        type: Number,
        default: 0
    },
    amountRecouped : {
        type: Number,
        default: 0
    }
}, { timestamps: true})

userSchema.plugin(mongooseUniqueValidator, {
    message: 'Error, {VALUE} already exists.'
});

const User = mongoose.model("User", userSchema);

export default User;

