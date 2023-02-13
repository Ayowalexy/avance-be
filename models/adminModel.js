import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;


const adminSchema = new Schema({
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
    role: {
        type: String,
        default: 'admin'
    }
})


adminSchema.plugin(mongooseUniqueValidator, {
    message: 'Error, {VALUE} already exists.'
});


const Admin = mongoose.model('admin', adminSchema);

export default Admin