import mongoose from "mongoose"

const applicationSchema = new mongoose.Schema({
    applicant: {  
        type: mongoose.Types.ObjectId,  
        ref: 'User', 
        required: true  
    },  
    job: {  
        type: mongoose.Types.ObjectId,  
        ref: 'Job',
        required: true  
    },  
    phoneNumber: {
        type: "String",
        default: ""
    },
    coverLetter: {  
        type: String,  
        default: ""  
    },  
    resume: {  
        type: String,
        default: ""  
    },  
    status: {  
        type: String,  
        enum: ['pending', 'accepted', 'rejected'],  
        default: 'pending'  
    },  
    preferredWorkingType: {  
        type: String,  
        enum: ['formal', 'informal'],  
        required: true  
    }  
}, {timestamps: true})

const Application = mongoose.model('Application', applicationSchema) 
export default Application