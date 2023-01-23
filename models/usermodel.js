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
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    requestId: {
        type: String,
        default: ""
    },
    ticketId: {
        type: String,
        default: ""
    },
    ticketStatus: {
        type: String,
        default: "idle",
        enum: ["sent", "verified", "pending", "idle"]
    },

}, { timestamps: true})

userSchema.plugin(mongooseUniqueValidator, {
    message: 'Error, {VALUE} already exists.'
});

userSchema.methods.isEmailVerified = async function() {
    return this.emailVerified
}

const User = mongoose.model("User", userSchema);

export default User;

