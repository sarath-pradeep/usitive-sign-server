import mongoose from "mongoose";

const userDetailsSchema = new mongoose.Schema({
    
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    companyName: {
        type: String,
        trim: true
    },
    referralSource: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        minlength: 6
    },
    is2FactAuthEnabled: {
        type: Boolean,
        default: false
    }
})

const UserDetails = mongoose.model("UserDetails", userDetailsSchema);
export default UserDetails;