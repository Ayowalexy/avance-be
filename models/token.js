import mongoose from "mongoose";


const periculumTokenSchema = new mongoose.Schema({
    token: String
})

const PericulumToken = new mongoose.model('periculumToken', periculumTokenSchema);

export default PericulumToken;